export const postRequest = async <TResponse>(
  url: string,
  body: object
): Promise<TResponse> => {
  try {
    const response = await fetch(`http://127.0.0.1:5000${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    console.error("Error in postRequest:", error);
    throw error;
  }
};
