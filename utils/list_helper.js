const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  if (blogs.length === 1) {
    return blogs[0].likes;
  }

  if (blogs.length > 1) {
    const sum = blogs.reduce((accumulator, currentBlog) => {
      return accumulator + currentBlog.likes;
    }, 0);

    return sum;
  }
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  if (blogs.length === 1) {
    return blogs[0];
  }

  if (blogs.length > 1) {
    const likesArray = blogs.map((blog) => blog.likes);
    const topLikes = Math.max(...likesArray);
    const { title, author, likes } = blogs.find(
      (blog) => blog.likes === topLikes
    );
    return { title, author, likes };
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
