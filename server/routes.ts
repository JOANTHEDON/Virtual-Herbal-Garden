import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlantSchema, insertBookmarkSchema, insertNoteSchema } from "@shared/schema";
import { getChatbotResponse } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // Plant routes
  app.get("/api/plants", async (req, res) => {
    try {
      const plants = await storage.getPlants();
      res.json(plants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plants" });
    }
  });

  app.get("/api/plants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plant = await storage.getPlant(id);
      if (plant) {
        res.json(plant);
      } else {
        res.status(404).json({ error: "Plant not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plant" });
    }
  });

  app.get("/api/plants/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const plants = await storage.searchPlants(query);
      res.json(plants);
    } catch (error) {
      res.status(500).json({ error: "Failed to search plants" });
    }
  });

  app.get("/api/plants/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const plants = await storage.getPlantsByCategory(category);
      res.json(plants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plants by category" });
    }
  });

  app.get("/api/plants/region/:region", async (req, res) => {
    try {
      const region = req.params.region;
      const plants = await storage.getPlantsByRegion(region);
      res.json(plants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plants by region" });
    }
  });

  // Virtual tours routes
  app.get("/api/tours", async (req, res) => {
    try {
      const tours = await storage.getVirtualTours();
      res.json(tours);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch virtual tours" });
    }
  });

  app.get("/api/tours/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tour = await storage.getVirtualTour(id);
      if (tour) {
        res.json(tour);
      } else {
        res.status(404).json({ error: "Virtual tour not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch virtual tour" });
    }
  });

  // Chatbot endpoint for Perplexity AI
  app.post("/api/chat", async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
      
      if (!perplexityApiKey) {
        // Return local response if no API key
        return res.json({ 
          response: "I'm your virtual herbalist assistant! I can help you learn about medicinal plants, their uses, and AYUSH principles. However, I need an API key to provide more detailed responses. Please ask me about specific plants like Turmeric, Neem, or Ashwagandha!" 
        });
      }

      const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are an expert virtual herbalist and AYUSH medicine specialist. Provide accurate, helpful information about medicinal plants, their uses, preparation methods, and traditional healing systems like Ayurveda, Unani, Siddha. Keep responses concise and educational.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.2,
          top_p: 0.9,
          return_images: false,
          return_related_questions: false,
          stream: false
        }),
      });

      if (perplexityResponse.ok) {
        const data = await perplexityResponse.json();
        const response = data.choices[0]?.message?.content || "I'm sorry, I couldn't process your question. Please try asking about specific medicinal plants or AYUSH principles.";
        res.json({ response });
      } else {
        res.json({ 
          response: "I'm having trouble accessing my knowledge base right now. Please try asking about specific plants like Turmeric for anti-inflammation or Ashwagandha for stress relief!" 
        });
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      res.json({ 
        response: "I'm your virtual herbalist assistant! Please ask me about medicinal plants, their uses, preparation methods, or AYUSH principles. I can help you learn about herbs like Turmeric, Neem, Ashwagandha, and more!" 
      });
    }
  });

  // Bookmark routes (simplified without authentication for demo)
  app.get("/api/bookmarks/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
  });

  app.post("/api/bookmarks", async (req, res) => {
    try {
      const bookmarkData = insertBookmarkSchema.parse(req.body);
      const bookmark = await storage.addBookmark(bookmarkData);
      res.json(bookmark);
    } catch (error) {
      res.status(400).json({ error: "Invalid bookmark data" });
    }
  });

  app.delete("/api/bookmarks/:userId/:plantId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const plantId = parseInt(req.params.plantId);
      const success = await storage.removeBookmark(userId, plantId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Bookmark not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to remove bookmark" });
    }
  });

  // Notes routes
  app.get("/api/notes/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const notes = await storage.getUserNotes(userId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.get("/api/notes/:userId/:plantId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const plantId = parseInt(req.params.plantId);
      const notes = await storage.getPlantNotes(userId, plantId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plant notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const noteData = insertNoteSchema.parse(req.body);
      const note = await storage.addNote(noteData);
      res.json(note);
    } catch (error) {
      res.status(400).json({ error: "Invalid note data" });
    }
  });

  // Chatbot API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await getChatbotResponse(message);
      res.json({ response });
    } catch (error) {
      console.error("Chatbot API error:", error);
      res.status(500).json({ error: "Failed to get chatbot response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
