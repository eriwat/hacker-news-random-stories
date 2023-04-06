/* eslint-disable jsx-a11y/aria-role */
import React, { useState, useEffect, useCallback } from "react";
import {fetchData} from "./DataHandling"
import {addFadeInEffectToImage, LoadingSpinner} from "./Helper"

const BASE_URL = "https://hacker-news.firebaseio.com/v0";
const TOP_STORIES_URL = `${BASE_URL}/topstories.json`;
const STORY_URL = `${BASE_URL}/item`;
const USER_URL = `${BASE_URL}/user`;

const Story = () => {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);

  /**
   * Generates a random image URL using the Lorem Picsum service.
   * The image dimensions are set to 800x600 pixels.
   * Randomized IDs are between 1 and 1000.
   *
   * @function
   * @returns {string} The randomly generated image URL.
   */
  const getRandomImage = () => {
    const id = Math.floor(Math.random() * 1000) + 1;
    return `https://picsum.photos/id/${id}/800/600`;
  };

  /**
   * Fetches ten random top stories from the Hacker News API,
   * sorts them by score, and updates the state with the fetched stories.
   *
   * @function
   * @async
   * @returns {Promise<void>} A promise resolving when the stories are fetched and state is updated.
   */
  const fetchRandomStories = useCallback(async () => {
    const topStoryIds = await fetchData(TOP_STORIES_URL);
    const randomIds = topStoryIds.sort(() => 0.5 - Math.random()).slice(0, 10);

    const storyData = await Promise.all(
      randomIds.map(async (id) => {
        const story = await fetchData(`${STORY_URL}/${id}.json`);
        const author = await fetchData(`${USER_URL}/${story.by}.json`);
        return { ...story, authorKarma: author.karma };
      })
    );

    storyData.sort((a, b) => a.score - b.score);
    setStories(storyData);
    setLoading(false);
  }, []);

  /**
   * useEffect hook that sets the loading state to true and fetches random stories
   * when the component mounts.
   */
  useEffect(() => {
    setLoading(true);
    fetchRandomStories();
  }, [fetchRandomStories]);

  return (
    <div className="cmp-story__container" role="region">
      {loading ? (
          <LoadingSpinner />
      ) : (
      <ul className="cmp-story__list">
        {stories.map(({ id, url, title, time, score, by, authorKarma }) => (
          <li key={id} className="cmp-story__list-item">
            <a
                className="cmp-story__link"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read "${title}" on Hacker News`}
            >
              <div className="cmp-story__list-item-content">
            <img
              src={getRandomImage()}
              alt={`Thumbnail for the story: ${title}`}
              className="cmp-story__image"
              onLoad={addFadeInEffectToImage}
              onError={addFadeInEffectToImage}
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

              <h3 className="cmp-story__title">{title}</h3>

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
              </div>
            </a>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
};

export default Story;
