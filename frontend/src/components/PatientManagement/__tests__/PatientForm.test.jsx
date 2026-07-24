import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PatientForm from "../PatientForm.jsx";

jest.mock("../../../api/client", () => ({
  api: { post: jest.fn() },
}));
import { api } from "../../../api/client";

function renderWithClient(ui) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("PatientForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders required fields", () => {
    renderWithClient(<PatientForm />);
    expect(screen.getByText("First name")).toBeInTheDocument();
    expect(screen.getByText("Last name")).toBeInTheDocument();
    expect(screen.getByText("Date of birth")).toBeInTheDocument();
  });

  function fillRequiredFields() {
    const textboxes = screen.getAllByRole("textbox"); // firstName, lastName, phone
    fireEvent.change(textboxes[0], { target: { value: "Jane" } });
    fireEvent.change(textboxes[1], { target: { value: "Doe" } });
    fireEvent.change(textboxes[2], { target: { value: "+201000000000" } });
    const dobInput = document.querySelector('input[type="date"]');
    fireEvent.change(dobInput, { target: { value: "1990-01-01" } });
  }

  it("submits the form and resets fields on success", async () => {
    api.post.mockResolvedValueOnce({ data: { _id: "1", firstName: "Jane", lastName: "Doe" } });

    renderWithClient(<PatientForm />);
    fillRequiredFields();
    fireEvent.click(screen.getByText("Register patient"));

    await waitFor(() => expect(api.post).toHaveBeenCalledWith("/patients", expect.objectContaining({ firstName: "Jane" })));
    await waitFor(() => expect(screen.getAllByRole("textbox")[0]).toHaveValue(""));
  });

  it("shows an error message when the API call fails", async () => {
    api.post.mockRejectedValueOnce({ response: { data: { message: "Phone required" } } });
    renderWithClient(<PatientForm />);
    fillRequiredFields();
    fireEvent.click(screen.getByText("Register patient"));

    await waitFor(() => expect(screen.getByText("Phone required")).toBeInTheDocument());
  });
});
