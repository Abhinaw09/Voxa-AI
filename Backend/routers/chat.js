
import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/voxa.js";

const router = express.Router();

// // TEST ROUTE
// router.post("/test", async (req, res) => {
//     try {
//         const thread = new Thread({
//             threadId: "xyz",
//             title: "Testing 1"
//         });

//         const response = await thread.save();

//         return res.status(201).json(response);
//     } catch (err) {
//         console.error("Test route error:", err);

//         return res.status(500).json({
//             error: "Failed to save in database"
//         });
//     }
// });

// GET ALL THREADS
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({})
            .sort({ updatedAt: -1 });

        return res.status(200).json(threads);
    } catch (err) {
        console.error("Get threads error:", err);

        return res.status(500).json({
            error: "Failed to fetch threads"
        });
    }
});

// GET MESSAGES OF A THREAD
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            return res.status(404).json({
                error: "Invalid thread ID"
            });
        }

        return res.status(200).json(thread.messages);
    } catch (err) {
        console.error("Get thread error:", err);

        return res.status(500).json({
            error: "Failed to fetch thread messages"
        });
    }
});

// DELETE A THREAD
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const deletedThread =
            await Thread.findOneAndDelete({ threadId });

        if (!deletedThread) {
            return res.status(404).json({
                error: "Thread not found"
            });
        }

        return res.status(200).json({
            success: "Thread deleted successfully"
        });
    } catch (err) {
        console.error("Delete thread error:", err);

        return res.status(500).json({
            error: "Failed to delete thread"
        });
    }
});

// CHAT ROUTE
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    // Validate request
    if (
        typeof threadId !== "string" ||
        !threadId.trim() ||
        typeof message !== "string" ||
        !message.trim()
    ) {
        return res.status(400).json({
            error: "threadId and message are required"
        });
    }

    try {
        
        let thread = await Thread.findOne({ threadId });

        
        if (!thread) {
            thread = new Thread({
                threadId,
                title: message.trim(),
                messages: [
                    {
                        role: "user",
                        content: message.trim()
                    }
                ]
            });
        } else {
           
            thread.messages.push({
                role: "user",
                content: message.trim()
            });
        }

       
        const assistantReply =
            await getOpenAIAPIResponse(message.trim());

        if (
            typeof assistantReply !== "string" ||
            !assistantReply.trim()
        ) {
            throw new Error("AI returned an empty response");
        }

        
        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });

        // Update timestamp
        thread.updatedAt = new Date();    

        // Save conversation
        await thread.save();

        // Return AI response
        return res.status(200).json({
            reply: assistantReply
        });

    } catch (err) {
        console.error("Chat route error:", err);

        return res.status(500).json({
            error: "Failed to process chat request"
        });
    }
});

export default router;