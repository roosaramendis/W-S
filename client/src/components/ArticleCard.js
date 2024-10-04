import React from "react";
import { useHistory } from "react-router-dom";
import { useArticleStyles } from "../styles/muiStyles";
import dayjs from "dayjs";

const ArticleCard = ({ data, userId }) => {
  const classes = useArticleStyles(); // Use the styles
  const history = useHistory();

  const handleClick = () => {
    // Navigate to the new page with data in state
    history.push({
      pathname: `/article/${encodeURIComponent(data.title)}`,
      state: { articleData: data },
    });
  };

  return (
    <div className={classes.articleCard}>
      <h2 className={classes.articleCardTitle}>{data.title}</h2>
      {data && data.author.id === userId && (
        <div className={classes.articleCardOwn}>Own</div>
      )}
      <div
        style={{
          maxHeight: "200px",
          overflowY: "scroll",
        }}
      >
        <p className={classes.articleCardContentText}>{data.content}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {data.tags.map((tag) => (
            <p key={tag} className={classes.articleTag}>
              #{tag}
            </p>
          ))}
        </div>
      </div>

      <div className={classes.articleCardBtnContainer}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {data.author && (
            <p className={classes.articleCardAuthor}>
              By {data.author.username}
            </p>
          )}
          <p className={classes.articleCardDate}>
            {dayjs(data.updatedAt).format("DD-MM-YYYY")}
          </p>
        </div>
        <button className={classes.articleCardBtn} onClick={handleClick}>
          Read More
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
