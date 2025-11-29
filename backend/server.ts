import express from 'express';
import cors from 'cors';
import { MockProfiles } from '../src/services/mock-profiles';

const app = express();
app.use(cors());
app.use(express.json());

// Simple endpoint to get a profile by id (from mock data)
app.get('/api/profile/:id', (req, res) => {
    const { id } = req.params;
    const profiles = MockProfiles.generate(10);
    const profile = profiles.find(p => p.id === id);
    if (profile) {
        res.json(profile);
    } else {
        res.status(404).json({ error: 'Profile not found' });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Backend server listening on http://localhost:${PORT}`);
});
