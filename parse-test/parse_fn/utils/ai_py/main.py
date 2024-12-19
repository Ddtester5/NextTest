from g4f.client import Client

client = Client()
responseText = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
    # Add any other necessary parameters
)
print(responseText.choices[0].message.content)

responseImg = client.images.generate(
    model="flux",
    prompt="a white siamese cat",
    response_format="url"
    # Add any other necessary parameters
)

image_url = responseImg.data[0].url
print(f"Generated image URL: {image_url}")