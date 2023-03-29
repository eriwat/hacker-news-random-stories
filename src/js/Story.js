/* eslint-disable jsx-a11y/aria-role */
import React, { useState, useEffect } from "react";

const BASE_URL = "https://hacker-news.firebaseio.com/v0";
const TOP_STORIES_URL = `${BASE_URL}/topstories.json`;
const STORY_URL = `${BASE_URL}/item`;
const USER_URL = `${BASE_URL}/user`;

const App = () => {
  const [stories, setStories] = useState([]);

  // to do - add error handling .catch
  const fetchData = async (url) => {
    const response = await fetch(url);
    return response.json();
  };

  const getRandomImage = () => {
    const id = Math.floor(Math.random() * 1000) + 1;
    return `https://picsum.photos/id/${id}/800/600`;
  };

  const fetchRandomStories = async () => {
    const topStoryIds = await fetchData(TOP_STORIES_URL);
    const randomIds = topStoryIds.sort(() => 0.5 - Math.random()).slice(0, 10);

    const storyData = await Promise.all(
      randomIds.map(async (id) => {
        const story = await fetchData(`${STORY_URL}/${id}.json`);
        const author = await fetchData(`${USER_URL}/${story.by}.json`);
        return { ...story, authorKarma: author.karma };
      })
    );

    // console.log("storyData:", storyData);

    storyData.sort((a, b) => a.score - b.score);
    setStories(storyData);
  };

  useEffect(() => {
    fetchRandomStories();
  }, []);

  return (
    <div className="cmp-story__container" role="region">
      <ul className="cmp-story__list">
        {stories.map(({ id, url, title, time, score, by, authorKarma }) => (
          <li key={id} className="cmp-story__list-item">
            <img
              src={getRandomImage()}
              alt={`Thumbnail for the story: ${title}`}
              className="cmp-story__image"
            />
            <div className="cmp-story__info">
              <div
                className="cmp-story__score"
                role="text"
                aria-label={`Story score: ${score}`}
              >
                <span>Score</span>
                {score}
              </div>
              <div className="cmp-story__time">
                {new Date(time * 1000).toLocaleString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </div>
              <a
                className="cmp-story__title"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read "${title}" on Hacker News`}
              >
                {title}
              </a>
              <div className="cmp-story__author-info" role="text">
                <span className="cmp-story__author-name">By {by} (</span>
                <span
                  className="cmp-story__author-karma"
                  aria-label="Author Karma Score:"
                >
                  {authorKarma})
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
