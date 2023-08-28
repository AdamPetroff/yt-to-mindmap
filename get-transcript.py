from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import JSONFormatter

transcript = YouTubeTranscriptApi.get_transcript("2NZMaI-HeNU")

formatter = JSONFormatter()

# .format_transcript(transcript) turns the transcript into a JSON string.
json_formatted = formatter.format_transcript(transcript)


# Now we can write it out to a file.
with open('your_filename.json', 'w') as json_file:
    json_file.write(json_formatted)