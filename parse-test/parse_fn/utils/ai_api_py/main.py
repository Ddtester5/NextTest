import base64
from g4f.client import Client

client = Client()
responseText = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Ты профессиональный переводчк и редактор статей.Переведи данный текст на русский язык и гапиши его в другом стиле, меняя выражения, чтобы сделать его уникальным. Выдай сразу ответ без коментарикв и пояснений.:  Oppo recently unveiled the Find X8 and Find X8 Pro, and is expected to announce the Find X8 Ultra and Find X8 Mini at some point early next year. Now an Oppo exec has clarified the company's upcoming launch strategy for the flagship Find line over on Weibo. According to Oppo's Zhou Yibao, there will be two launch events for the Find series each year, one in the spring, the other in the autumn (or fall if you're American). The Find X8 and Find X8 Pro launched in the autumn/fall, and so we assume this means the Find X8 Ultra and Find X8 Mini are coming in the spring. The Find N5 will, however, launch before them, according to the same exec.     The Find N5 will be rebranded outside of China and sold as the OnePlus Open 2. This phone's specs and first renders leaked earlier today, go check them out. According to Digital Chat Station, the Find X8 Ultra prototypes currently in testing have a telephoto macro camera, but the output isn't that great so it remains to be seen if this will still be used or swapped out last-minute. Via"}],
    # Add any other necessary parameters
)
print(responseText.choices[0].message.content)

# response = client.images.generate(
#     model="flux",
#     prompt="ауди ку7 белая",
#     response_format="url"
#     # Add any other necessary parameters
    
# )

# image_url = response.data[0].url
# print(f"Generated image URL: {image_url}")

def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        base64_string = base64.b64encode(image_file.read()).decode("utf-8")
    return base64_string

# Путь к существующему изображению
image_path = "./parse_results/init/img/news/2024_winners_and_los_cm57y6bf00007ck8b3vjchotc.jpg"

# Конвертируем изображение в Base64
image_base64 = image_to_base64(image_path)

# Генерируем вариацию изображения
response = client.images.generate(
    model="flux",
    prompt=f"Generate variation of this image : {image_base64}",
    image=image_base64,
    response_format="url",
)

# Извлекаем URL сгенерированного изображения
if response and response.data:
    image_url = response.data[0].url
    print(f"Generated image URL: {image_url}")
else:
    print("Failed to generate image.")