const express=require("express")
const router=express.Router();
const User=require("../models/User")
const Video=require("../models/Videos")

router.get("/getsearchdata",async (req,res)=>{
    try{    
        const searchdata=await Video.find({}).populate(
            {
                path:"user",
                select:"name"
            }
            
        ).select("title")
        return res.status(200).json(searchdata);
    }
    catch(error){
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
})


router.get('/getsearchvideos/:query', async (req, res) => {
    try {
        const searchQuery = req.params.query.trim();  // Get the search query from request

        if (!searchQuery) {
            return res.status(400).json({ message: "No search query provided" });
        }

        // MongoDB query to search videos by title or user's name (case-insensitive)
        const videos = await Video.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },       // Matches partial titles
                { description: { $regex: searchQuery, $options: 'i' } },
                { 'user.name': { $regex: searchQuery, $options: 'i' } }  // Matches user name
            ]
        }).populate('user', 'name');

         // If no videos found, return early
         if (!videos || videos.length === 0) {
            return res.json([]); // Return empty array if no results
        }

         // Sorting by relevance: exact match > starts with > contains match
        //  const sortedVideos = videos.sort((a, b) => {
        //     const aTitle = a.title ? a.title.toLowerCase() : ''; // Handle undefined titles
        //     const bTitle = b.title ? b.title.toLowerCase() : '';
        //     const aUserName = a.user && a.user.name ? a.user.name.toLowerCase() : ''; // Handle undefined user or user.name
        //     const bUserName = b.user && b.user.name ? b.user.name.toLowerCase() : '';
        //     const searchLower = searchQuery.toLowerCase();

        //     const aTitleStartsWith = aTitle.startsWith(searchLower);
        //     const bTitleStartsWith = bTitle.startsWith(searchLower);
        //     const aUserStartsWith = aUserName.startsWith(searchLower);
        //     const bUserStartsWith = bUserName.startsWith(searchLower);

        //     // Priority order: exact match > starts with > contains match
        //     if (aTitle === searchLower) return -1;
        //     if (bTitle === searchLower) return 1;
        //     if (aUserName === searchLower) return -1;
        //     if (bUserName === searchLower) return 1;
        //     if (aTitleStartsWith && !bTitleStartsWith) return -1;
        //     if (!aTitleStartsWith && bTitleStartsWith) return 1;
        //     if (aUserStartsWith && !bUserStartsWith) return -1;
        //     if (!aUserStartsWith && bUserStartsWith) return 1;

        //     // Fallback: If neither start with search query, prioritize contains match
        //     const aTitleContains = aTitle.includes(searchLower);
        //     const bTitleContains = bTitle.includes(searchLower);
        //     const aUserContains = aUserName.includes(searchLower);
        //     const bUserContains = bUserName.includes(searchLower);

        //     if (aTitleContains && !bTitleContains) return -1;
        //     if (!aTitleContains && bTitleContains) return 1;
        //     if (aUserContains && !bUserContains) return -1;
        //     if (!aUserContains && bUserContains) return 1;

        //     // If neither start with search query, default to the original order
        //     return 0;
        // });

        // Sorting by relevance: exact match > starts with > contains match
        const sortedVideos = videos.sort((a, b) => {
            const searchLower = searchQuery.toLowerCase();

            // Helper function to get relevance score for title, description, and user name
            const getRelevance = (video) => {
                const title = video.title ? video.title.toLowerCase() : '';
                const description = video.description ? video.description.toLowerCase() : '';
                const userName = video.user && video.user.name ? video.user.name.toLowerCase() : '';

                // Prioritize exact matches
                if (title === searchLower || description === searchLower || userName === searchLower) return 3;
                // Then prioritize starts-with matches
                if (title.startsWith(searchLower) || description.startsWith(searchLower) || userName.startsWith(searchLower)) return 2;
                // Lastly prioritize contains matches
                if (title.includes(searchLower) || description.includes(searchLower) || userName.includes(searchLower)) return 1;

                // No relevance
                return 0;
            };

            // Compare relevance scores of the two videos
            const relevanceA = getRelevance(a);
            const relevanceB = getRelevance(b);

            // Sort based on relevance score (higher first)
            return relevanceB - relevanceA;
        });

        return res.json(sortedVideos);  // Return the matching videos
    } catch (error) {
        console.error("Error fetching search data:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports=router;