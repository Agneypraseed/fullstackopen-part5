import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

test("renders blog's title and author", () => {
  const blog = {
    title: "test Blog",
    author: "tester",
    url: "test@test.com",
    likes: 100,
  };

  const { container } = render(<Blog blog={blog} />);

  const div = container.querySelector(".blog");
  const textContent = div.textContent;
  expect(textContent).toContain(blog.title);
  expect(textContent).toContain(blog.author);

  const div2 = container.querySelector(".blogdetails");
  expect(div2).toBeNull();

  const url = screen.queryByText("test@test.com");
  expect(url).toBeNull();
});

test("click on button view will the shown details", async () => {
  const user = userEvent.setup();
  const blog = {
    title: "test Blog",
    author: "tester",
    url: "test@test.com",
    likes: 100,
    user: "652a4e1162ee1ca7690f3fc0",
  };
  window.localStorage.setItem("user", JSON.stringify({ username: "tester" }));

  const { container } = render(<Blog blog={blog} />);

  const button = screen.getByText("view");
  await user.click(button);

  const div = container.querySelector(".blogdetails");
  const textContent = div.textContent;
  expect(textContent).toContain(blog.url);
  expect(textContent).toContain(blog.likes.toString());
});

test("click on the like button increase like", async () => {
  const user = userEvent.setup();
  const blog = {
    title: "test Blog",
    author: "tester",
    url: "test@test.com",
    likes: 100,
    user: "652a4e1162ee1ca7690f3fc0",
  };
  window.localStorage.setItem("user", JSON.stringify({ username: "tester" }));

  const mockHandler = jest.fn();

  render(<Blog blog={blog} addLike={mockHandler}/>);

  const button = screen.getByText("view");
  await user.click(button);

  const likeButton = screen.getByText("like");  

  await user.click(likeButton);
  await user.click(likeButton);    

  expect(mockHandler.mock.calls).toHaveLength(2);
});
