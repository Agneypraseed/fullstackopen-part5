import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

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
