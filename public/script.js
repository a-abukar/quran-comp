document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generate-btn');
  const verseContent = document.getElementById('verse-content');
  const verseDetails = document.getElementById('verse-details');
  const bookmarkBtn = document.getElementById('bookmark-btn');
  const audioBtn = document.getElementById('audio-btn');
  const quizBtn = document.getElementById('quiz-btn');
  const shareBtn = document.getElementById('share-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const bookmarkList = document.getElementById('bookmark-list');
  const themeToggle = document.getElementById('theme-toggle');
  const quizSection = document.getElementById('quiz-section');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const quizFeedback = document.getElementById('quiz-feedback');
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  let currentVerseData = null;

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

  // Map chapter and verse to the correct Juz
  function getJuzNumber(chapter, verse) {
      for (let juz in juzMapping) {
          const ranges = juzMapping[juz];
          for (let range of ranges) {
              if (range.surah === chapter && verse >= range.start && verse <= range.end) {
                  return parseInt(juz, 10);
              }
          }
      }
      return null;
  }

  // Function to fetch and display a verse based on chapter and verse number
  function fetchVerse(chapter, verse) {
      console.log(`Fetching verse: Chapter ${chapter}, Verse ${verse}`);
      const juzNumber = getJuzNumber(chapter, verse);
      if (!juzNumber) {
          console.error('Invalid Juz Number: Could not determine Juz for the given chapter and verse.');
          alert('Invalid Juz Number.');
          return;
      }

      fetch(`/verse?chapters=${juzNumber}&chapter=${chapter}&verse=${verse}`)
          .then(response => response.json())
          .then(data => {
              if (data.error) throw new Error(data.error);

              currentVerseData = data;
              updateVerseContent(data);
              updateVerseDetails(data);
              updateControls();
          })
          .catch(error => {
              console.error('Error fetching verse:', error);
              alert('An error occurred while fetching the verse. Please try again.');
          });
  }

  // Update verse content
  function updateVerseContent(data) {
      verseContent.innerHTML = `
          <p><strong>Verse:</strong></p>
          <p>${data.text}</p>
          <p><strong>Translation:</strong></p>
          <p>${data.translation || "Translation not available"}</p>
      `;
  }

  // Update verse details
  function updateVerseDetails(data) {
      const juzNumber = getJuzNumber(data.chapter, data.verse);

      console.log('Juz Number:', juzNumber);
      console.log('Verse Details:', data);

      verseDetails.innerHTML = `
          <p><strong>Chapter (Juz):</strong> ${juzNumber !== null ? juzNumber : "Unknown"}</p>
          <p><strong>Surah:</strong> ${data.chapter}</p>
          <p><strong>Verse:</strong> ${data.verse}</p>
      `;
  }

  // Enable the extra controls
  function updateControls() {
      bookmarkBtn.disabled = false;
      audioBtn.disabled = false;
      quizBtn.disabled = false;
      shareBtn.disabled = false;

      // Set data attributes safely
      bookmarkBtn.dataset.currentVerse = JSON.stringify(currentVerseData);
      audioBtn.dataset.currentVerse = JSON.stringify(currentVerseData);
      quizBtn.dataset.currentVerse = JSON.stringify(currentVerseData);
      shareBtn.dataset.currentVerse = JSON.stringify(currentVerseData);
  }

  // Generate a verse on button click
  generateBtn.addEventListener('click', () => {
      const chaptersInput = document.getElementById('chapters').value;
      fetchVerseByChapters(chaptersInput);
  });

  // Function to fetch a verse by chapter input (e.g., Juz)
  function fetchVerseByChapters(chaptersInput) {
      const juzNumber = chaptersInput; // assuming chaptersInput is the Juz number or range directly
      console.log('Fetching verse by chapters:', juzNumber); // Debugging log
      fetch(`/verse?chapters=${juzNumber}`)
          .then(response => response.json())
          .then(data => {
              if (data.error) {
                  alert(data.error);
                  return;
              }

              currentVerseData = data;
              updateVerseContent(data);
              updateVerseDetails(data);
              updateControls();
          })
          .catch(error => console.error('Error fetching verse by chapters:', error));
  }

  // Navigate to the previous verse
  prevBtn.addEventListener('click', () => {
      try {
          if (!currentVerseData) throw new Error('No current verse data available.');
          let { chapter, verse } = currentVerseData;

          if (verse > 1) {
              // Move to the previous verse in the same chapter
              verse -= 1;
          } else if (chapter > 1) {
              // Move to the last verse of the previous chapter
              chapter -= 1;
              verse = getLastVerseOfChapter(chapter);
          } else {
              // Already at the first verse of the Quran
              console.log('Already at the first verse.');
              return;
          }

          fetchVerse(chapter, verse);
      } catch (error) {
          console.error('Error in prevBtn click handler:', error);
      }
  });

  // Navigate to the next verse
  nextBtn.addEventListener('click', () => {
      try {
          if (!currentVerseData) throw new Error('No current verse data available.');
          let { chapter, verse } = currentVerseData;

          const lastVerseInChapter = getLastVerseOfChapter(chapter);
          if (verse < lastVerseInChapter) {
              verse += 1;
          } else {
              chapter += 1;
              verse = 1;
          }

          fetchVerse(chapter, verse);
      } catch (error) {
          console.error('Error in nextBtn click handler:', error);
      }
  });

  // Helper function to get the last verse of a chapter
  function getLastVerseOfChapter(chapter) {
      const surahData = juzMapping[chapter];
      if (!surahData) return null;

      return Math.max(...surahData.map(range => range.end));
  }

  // Bookmark the current verse
  bookmarkBtn.addEventListener('click', () => {
      if (!currentVerseData) return;
      bookmarks.push(currentVerseData);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      displayBookmarks();
  });

  // Play audio recitation
  audioBtn.addEventListener('click', () => {
      if (!currentVerseData) return;
      const surahNumber = String(currentVerseData.chapter).padStart(3, '0');
      const verseNumber = String(currentVerseData.verse).padStart(3, '0');

      const audioUrl = `https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/${surahNumber}${verseNumber}.mp3`;

      const audio = new Audio(audioUrl);
      audio.play().catch((error) => {
          console.error("Audio playback failed:", error);
          alert("Recitation audio is not available for this verse.");
      });
  });

  // Quiz mode logic with feedback
  quizBtn.addEventListener('click', () => {
      if (!currentVerseData) return;
      const textArray = currentVerseData.text.split(' ');
      const hiddenWordIndex = Math.floor(Math.random() * textArray.length);
      const correctAnswer = textArray[hiddenWordIndex];
      textArray[hiddenWordIndex] = '_______';

      let options = generateQuizOptions(correctAnswer, textArray);
      options = options.sort(() => Math.random() - 0.5);

      quizQuestion.textContent = textArray.join(' ');

      quizOptions.innerHTML = options.map(option => `
          <button class="quiz-option">${option}</button>
      `).join('');

      quizSection.style.display = 'block';
      quizFeedback.textContent = ''; // Reset feedback

      document.querySelectorAll('.quiz-option').forEach(btn => {
          btn.addEventListener('click', () => {
              const selectedAnswer = btn.textContent;
              if (selectedAnswer === correctAnswer) {
                  quizFeedback.textContent = 'Correct!';
                  quizFeedback.style.color = 'green';
              } else {
                  quizFeedback.textContent = 'Try Again!';
                  quizFeedback.style.color = 'red';
              }
          });
      });
  });

  // Function to generate quiz options
  function generateQuizOptions(correctAnswer, textArray) {
      const options = new Set();
      options.add(correctAnswer);

      while (options.size < 4) {
          const randomIndex = Math.floor(Math.random() * textArray.length);
          const randomWord = textArray[randomIndex];
          if (randomWord !== '_______' && !options.has(randomWord)) {
              options.add(randomWord);
          }
      }

      return Array.from(options);
  }

  // Share the verse on social media
  shareBtn.addEventListener('click', () => {
      if (!currentVerseData) return;
      const shareText = `Check out this verse from the Qur'an: "${currentVerseData.text}" - Surah ${currentVerseData.chapter}, Verse ${currentVerseData.verse}`;
      if (navigator.share) {
          navigator.share({
              title: 'Qur\'an Verse',
              text: shareText,
              url: window.location.href
          }).then(() => {
              console.log('Thanks for sharing!');
          }).catch(console.error);
      } else {
          prompt("Copy this text and share it:", shareText);
      }
  });

  // Display bookmarks
  function displayBookmarks() {
      bookmarkList.innerHTML = '<h4>Bookmarked Verses:</h4>';
      bookmarks.forEach((verse, index) => {
          bookmarkList.innerHTML += `<p>${index + 1}. Surah ${verse.chapter}, Verse ${verse.verse}: "${verse.text}"</p>`;
      });
      bookmarkList.style.display = 'block';
  }

  // Load bookmarks on startup
  displayBookmarks();

  // Toggle light/dark mode
  themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  });
});
