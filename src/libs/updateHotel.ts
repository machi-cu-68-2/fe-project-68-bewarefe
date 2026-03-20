export default async function updateHotel(
  token: string,
  hotelId: string,
  name: string,
  address: string,
  tel: string,
  picture?: string,
  rating?: number,
  description?: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name, address, tel,
        ...(picture !== undefined ? { picture } : {}),
        ...(rating !== undefined ? { rating } : {}),
        ...(description !== undefined ? { description } : {}),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update hotel");
  }

  return data;
}
