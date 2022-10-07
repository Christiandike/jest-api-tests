const listHelper = require('../utils/list_helper');
const blog = require('../models/bloglist');

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes([{ name: 'nnamdi', likes: 5 }]);
    expect(result).toBe(5);
  });

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blog);
    expect(result).toBe(36);
  });
});
