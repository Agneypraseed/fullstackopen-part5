import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> creates a new blog", async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText("Create");

  await user.type(inputs[0], 'test Blog')
  await user.type(inputs[1], 'tester Agney')
  await user.type(inputs[2], 'test url')
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);    

  expect(createBlog.mock.calls[0][0].title).toBe("test Blog");
  expect(createBlog.mock.calls[0][0].author).toBe("tester Agney");
});
