const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const juzMapping = {
    1: [{ surah: 1, start: 1, end: 7 }, { surah: 2, start: 1, end: 141 }],
    2: [{ surah: 2, start: 142, end: 252 }],
    3: [{ surah: 2, start: 253, end: 286 }, { surah: 3, start: 1, end: 92 }],
    4: [{ surah: 3, start: 93, end: 200 }, { surah: 4, start: 1, end: 23 }],
    5: [{ surah: 4, start: 24, end: 147 }],
    6: [{ surah: 4, start: 148, end: 176 }, { surah: 5, start: 1, end: 81 }],
    7: [{ surah: 5, start: 82, end: 120 }, { surah: 6, start: 1, end: 110 }],
    8: [{ surah: 6, start: 111, end: 165 }, { surah: 7, start: 1, end: 87 }],
    9: [{ surah: 7, start: 88, end: 206 }, { surah: 8, start: 1, end: 40 }],
    10: [{ surah: 8, start: 41, end: 75 }, { surah: 9, start: 1, end: 93 }],
    11: [{ surah: 9, start: 94, end: 129 }, { surah: 10, start: 1, end: 109 }],
    12: [{ surah: 11, start: 1, end: 123 }, { surah: 12, start: 1, end: 52 }],
    13: [{ surah: 12, start: 53, end: 111 }, { surah: 13, start: 1, end: 43 }, { surah: 14, start: 1, end: 52 }],
    14: [{ surah: 15, start: 1, end: 99 }, { surah: 16, start: 1, end: 128 }],
    15: [{ surah: 17, start: 1, end: 111 }, { surah: 18, start: 1, end: 74 }],
    16: [{ surah: 18, start: 75, end: 110 }, { surah: 19, start: 1, end: 98 }, { surah: 20, start: 1, end: 135 }],
    17: [{ surah: 21, start: 1, end: 112 }, { surah: 22, start: 1, end: 78 }],
    18: [{ surah: 23, start: 1, end: 118 }, { surah: 24, start: 1, end: 64 }],
    19: [{ surah: 25, start: 1, end: 77 }, { surah: 26, start: 1, end: 227 }],
    20: [{ surah: 27, start: 1, end: 93 }, { surah: 28, start: 1, end: 55 }],
    21: [{ surah: 28, start: 56, end: 88 }, { surah: 29, start: 1, end: 69 }, { surah: 30, start: 1, end: 60 }],
    22: [{ surah: 33, start: 31, end: 30 }, { surah: 33, start: 31, end: 73 }, { surah: 34, start: 1, end: 54 }],
    23: [{ surah: 36, start: 28, end: 83 }, { surah: 37, start: 1, end: 182 }],
    24: [{ surah: 38, start: 1, end: 88 }, { surah: 39, start: 1, end: 31 }],
    25: [{ surah: 39, start: 32, end: 75 }, { surah: 40, start: 1, end: 85 }, { surah: 41, start: 1, end: 46 }],
    26: [{ surah: 41, start: 47, end: 54 }, { surah: 42, start: 1, end: 53 }, { surah: 43, start: 1, end: 89 }],
    27: [{ surah: 44, start: 1, end: 59 }, { surah: 45, start: 1, end: 37 }, { surah: 46, start: 1, end: 35 }],
    28: [{ surah: 47, start: 1, end: 38 }, { surah: 48, start: 1, end: 29 }, { surah: 49, start: 1, end: 18 }, { surah: 50, start: 1, end: 45 }, { surah: 51, start: 1, end: 30 }],
    29: [{ surah: 67, start: 1, end: 30 }, { surah: 68, start: 1, end: 52 }, { surah: 69, start: 1, end: 52 }, { surah: 70, start: 1, end: 44 }],
    30: [{ surah: 78, start: 1, end: 40 }, { surah: 79, start: 1, end: 46 }, { surah: 80, start: 1, end: 42 }, { surah: 81, start: 1, end: 29 }, { surah: 82, start: 1, end: 19 }, { surah: 83, start: 1, end: 36 }, { surah: 84, start: 1, end: 25 }, { surah: 85, start: 1, end: 22 }]
};

app.use(express.static(path.join(__dirname, 'public')));

function parseJuzInput(juzInput) {
    if (!juzInput) {
        throw new Error("Juz input is undefined or null.");
    }

    return juzInput.split(',').map(juz => {
        if (juz.includes('-')) {
            const [start, end] = juz.split('-').map(Number);
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }
        return Number(juz.trim());
    }).flat();
}

// Helper function to get verse by chapter and verse
function getVerseByChapterAndVerse(quranData, chapter, verse) {
    const surah = quranData[chapter];
    if (!surah) {
        return null;
    }
    return surah.find(v => v.verse === verse);
}

// API endpoint to get a verse
app.get('/api/verse', (req, res) => {
    try {
        const chapters = req.query.chapters;
        const chapter = parseInt(req.query.chapter, 10);
        const verse = parseInt(req.query.verse, 10);

        console.log('Received chapters query parameter:', chapters);
        console.log('Received chapter:', chapter);
        console.log('Received verse:', verse);

        if (!chapters) {
            throw new Error('Chapters query parameter is missing or invalid.');
        }

        const juzNumbers = parseJuzInput(chapters);
        console.log('Parsed Juz:', juzNumbers);

        fs.readFile(path.join(__dirname, '../data', 'quran.json'), 'utf8', (err, quranData) => {
            if (err) {
                console.error('Error reading Quran data:', err);
                return res.status(500).json({ error: 'Failed to load Quran data' });
            }

            fs.readFile(path.join(__dirname, '../data', 'translate.json'), 'utf8', (err, translateData) => {
                if (err) {
                    console.error('Error reading translation data:', err);
                    return res.status(500).json({ error: 'Failed to load translation data' });
                }

                const quran = JSON.parse(quranData);
                const translation = JSON.parse(translateData);

                let verseData = null;

                if (chapter && verse) {
                    // Get a specific verse
                    verseData = getVerseByChapterAndVerse(quran, chapter, verse);
                }

                if (!verseData) {
                    let selectedVerses = [];

                    juzNumbers.forEach(juz => {
                        if (juzMapping[juz]) {
                            juzMapping[juz].forEach(range => {
                                const surahVerses = quran[range.surah];
                                const surahTranslation = translation.find(surah => surah.id === range.surah);

                                if (surahVerses && surahTranslation) {
                                    surahVerses.filter(verse => verse.verse >= range.start && verse.verse <= range.end)
                                        .forEach(verse => {
                                            const verseTranslation = surahTranslation.verses.find(v => v.id === verse.verse);
                                            selectedVerses.push({
                                                chapter: verse.chapter,
                                                verse: verse.verse,
                                                text: verse.text,
                                                translation: verseTranslation ? verseTranslation.translation : "No translation available"
                                            });
                                        });
                                }
                            });
                        }
                    });

                    if (selectedVerses.length === 0) {
                        console.log('No verses found for selected Juz:', juzNumbers);
                        return res.status(404).json({ error: 'No verses found for the selected Juz' });
                    }

                    verseData = selectedVerses[Math.floor(Math.random() * selectedVerses.length)];
                }

                if (!verseData) {
                    return res.status(404).json({ error: 'Verse not found' });
                }

                // Add translation to the verse data
                const surahTranslation = translation.find(surah => surah.id === verseData.chapter);
                const verseTranslation = surahTranslation?.verses.find(v => v.id === verseData.verse);

                res.json({
                    chapter: verseData.chapter,
                    verse: verseData.verse,
                    text: verseData.text,
                    translation: verseTranslation ? verseTranslation.translation : "No translation available"
                });
            });
        });
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(400).json({ error: 'Invalid input' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});