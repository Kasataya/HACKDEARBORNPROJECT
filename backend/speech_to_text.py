import speech_recognition as sr


class SpeechRecognition:
    def __init__(self):
        self.recognizer = sr.Recognizer()

    #function associated with the button that will record the users voice,
    #and convert it into text
    def start_recording(self):
            
        #records the audio from microphone using PyAudio
        with sr.Microphone() as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=0.2)
            audio = self.recognizer.listen(source)
                

        try:
            #convert speech to text using Google Web Speech API
            text = self.recognizer.recognize_google(audio)
            text = text.lower()
            print(f"Recognized Text: {text}")


        #displays error messages depending on complication
        except sr.UnknownValueError:
            print("Google API could not understand.")
        except sr.RequestError as e:
            print(f"Could not request, Check Internet Connection; {e}")

# Create an instance of the class
recognize = SpeechRecognition()

# Run the start_recording method
recognize.start_recording()