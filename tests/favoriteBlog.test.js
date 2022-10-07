const listHelper = require('../utils/list_helper');
const blog = require('../models/bloglist');

describe('favorite blog', () => {
  test('of empty list is zero', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe(0);
  });

  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.favoriteBlog([
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12,
      },
    ]);
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    });
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(blog);
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    });
  });
});

// when comparing objects, use toEqual (used for checking properties)
// toBe (used for comparing values)
