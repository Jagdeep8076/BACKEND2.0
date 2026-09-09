import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, type GraphNode, StateGraph, START, END, ReducedValue } from "@langchain/langgraph";
import { mistralModel, cohoreModel, geminiModel, groqModel, cerebrasModel} from "./models.service.js";
import { createAgent, providerStrategy } from "langchain";
import { z } from "zod"

const State = new StateSchema({
    messages: MessagesValue,

    solution_1: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next;
        }
    }),

    solution_2: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next;
        }
    }),

    judge_recommendation: new ReducedValue(
        z.object({
            solution_1_score: z.number().default(0),
            solution_2_score: z.number().default(0),
        }).default({
            solution_1_score: 0,
            solution_2_score: 0,
        }),
        {
            reducer: (current, next) => {
                return next;
            }
        }
    )
});

const solutionNode: GraphNode<typeof State> = async (state) => {

    console.log("Current State:", state);

    const providers = [
        {
            name: "Mistral",
            model: mistralModel
        },
        {
            name: "Cohere",
            model: cohoreModel
        },
        {
            name: "Groq",
            model: groqModel
        },
        {
            name: "Cerebras",
            model: cerebrasModel
        }
    ];

    const results = await Promise.allSettled(
        providers.map(provider =>
            provider.model.invoke(state.messages[0].content)
        )
    );

    const successfulSolutions = results
        .map((result, index) => {

            if (result.status === "fulfilled") {

                console.log(
                    ` ${providers[index].name} Success`
                );

                return {
                    provider: providers[index].name,
                    answer: result.value.text
                };

            } else {

                console.error(
                    ` ${providers[index].name} Error:`,
                    result.reason
                );

                return null;
            }
        })
        .filter(
            (
                solution
            ): solution is {
                provider: string;
                answer: string;
            } => solution !== null
        );

    console.log(
        "Successful Providers:",
        successfulSolutions.map(solution => solution.provider)
    );

    if (successfulSolutions.length < 2) {
        throw new Error(
            `Battle failed: only ${successfulSolutions.length} AI providers responded successfully.`
        );
    }

    const solution_1 = successfulSolutions[0];
    const solution_2 = successfulSolutions[1];

    console.log(
        ` Battle Participants: ${solution_1.provider} vs ${solution_2.provider}`
    );

    return {
        solution_1: solution_1.answer,
        solution_2: solution_2.answer
    };
};

const judgeNode: GraphNode<typeof State> = async (state) => {

    console.log("Invoking judge with state:", state);

    const { solution_1, solution_2 } = state;

    const judge = createAgent({
        model: geminiModel,
        tools: [],
        responseFormat: providerStrategy(
            z.object({
                solution_1_score: z.number().min(0).max(10),
                solution_2_score: z.number().min(0).max(10),
            })
        )
    });

    const judgeResponse = await judge.invoke({
        messages: [
            new HumanMessage(
                `You are a judge tasked with evaluating the quality of two solutions to a problem.

The problem is:
${state.messages[0].content}

The first solution is:
${solution_1}

The second solution is:
${solution_2}

Please provide a score between 0 and 10 for each solution, where 0 means the solution is completely incorrect or irrelevant, and 10 means the solution is perfect and fully addresses the problem.`
            )
        ]
    });

    const result = judgeResponse.structuredResponse;

    return {
        judge_recommendation: result
    };
};

const graph = new StateGraph(State)
    .addNode("solution", solutionNode)
    .addNode("judge", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge")
    .addEdge("judge", END)
    .compile();

export default async function (userMessage: string) {

    const result = await graph.invoke({
        messages: [
            new HumanMessage(userMessage)
        ]
    });

    console.log("Final Result:", result);

    return result;
}