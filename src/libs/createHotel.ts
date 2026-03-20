export default async function createHotel(
  token: string,
  name: string,
  address: string,
  tel: string,
  picture?: string,
  rating?: number,
  description?: string
) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/hotels`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name, address, tel,
        ...(picture ? { picture } : {}),
        ...(rating ? { rating } : {}),
        ...(description ? { description } : {}),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create hotel");
  }

  return data;
}
