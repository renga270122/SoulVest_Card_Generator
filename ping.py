import requests

# List of your Streamlit app URLs
URLS = [
    "https://soulvest-well.streamlit.app/",
    "https://soulvest-skill.streamlit.app/",
    "https://soulvest-lovebook.streamlit.app/",
    "https://soulvest-music.streamlit.app/",
    "https://soulvest-affirmation.streamlit.app/"
]

def ping_all():
    for url in URLS:
        try:
            response = requests.get(url)
            print(f"Pinged {url} - Status: {response.status_code}")
        except Exception as e:
            print(f"Failed to ping {url}: {e}")

if __name__ == "__main__":
    ping_all()
