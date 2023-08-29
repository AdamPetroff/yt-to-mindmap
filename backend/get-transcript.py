import sys
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import JSONFormatter

if len(sys.argv) < 3:
    print("Usage: script_name.py <video_id> <output_filename>")
    sys.exit(1)

video_id = sys.argv[1]
filename = sys.argv[2]

transcript = YouTubeTranscriptApi.get_transcript(video_id)
formatter = JSONFormatter()
json_formatted = formatter.format_transcript(transcript)

# Now we can write it out to a file.
with open(filename, 'w') as json_file:
    json_file.write(json_formatted)

print(json_formatted)
