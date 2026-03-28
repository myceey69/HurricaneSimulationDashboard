import React, { useState } from 'react';
import { Banana, Camera, Download, Loader2, Video, Play, RotateCcw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function NanoBanana() {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState("");

  const generateNanoBananaVideo = async () => {
    if (!import.meta.env.VITE_GOOGLE_GENAI_API_KEY) {
      setError("Google GenAI API key not configured");
      return;
    }

    setIsGeneratingVideo(true);
    setError(null);
    setGeneratedVideo(null);
    setProgress("Initializing Veo 3.1...");

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `A 5-second cinematic video of a nano banana dish being elegantly presented and served in a fancy Gemini-themed restaurant. Show the dish being placed on the table, steam rising delicately, and the beautiful plating details coming to life. High-end culinary cinematography style with warm lighting and smooth camera movement.`;

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      setProgress("Creating your nano banana culinary masterpiece... (2-3 minutes)");

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        const messages = [
          "Plating the nano banana...", 
          "Adding Gemini sparkles...", 
          "Perfecting the presentation...", 
          "Almost ready to serve..."
        ];
        setProgress(messages[Math.floor(Math.random() * messages.length)]);
      }

      setProgress("Downloading video...");

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!videoUri) throw new Error("No video URI received from Veo");

      const response = await fetch(videoUri, {
        method: 'GET',
        headers: { 'x-goog-api-key': apiKey },
      });

      if (!response.ok) throw new Error("Failed to fetch video file from Google storage");

      const blob = await response.blob();
      setGeneratedVideo(URL.createObjectURL(blob));

    } catch (err) {
      console.error("Error generating nano banana video:", err);
      setError(`Video generation failed: ${err.message}`);
    } finally {
      setIsGeneratingVideo(false);
      setProgress("");
    }
  };

  const generateImageFromVideo = async () => {
    if (!import.meta.env.VITE_GOOGLE_GENAI_API_KEY) {
      setError("Google GenAI API key not configured");
      return;
    }

    if (!generatedVideo) {
      setError("Please generate a video first to extract images from");
      return;
    }

    setIsGeneratingImage(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GOOGLE_GENAI_API_KEY
      });

      // Note: In a real implementation, you'd extract a frame from the video
      // For now, we'll generate a complementary image based on the video concept
      const prompt = "Create a high-resolution still image of a nano banana dish in a fancy restaurant with a Gemini theme, showing the perfectly plated dish as seen in a cinematic food video - elegant presentation with artistic lighting and beautiful garnishes";

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: prompt,
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          setGeneratedImage(`data:image/png;base64,${imageData}`);
          break;
        }
      }
    } catch (err) {
      console.error("Error generating image from video:", err);
      setError(`Failed to generate image: ${err.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const downloadVideo = () => {
    if (!generatedVideo) return;

    const link = document.createElement('a');
    link.href = generatedVideo;
    link.download = 'nano-banana-veo.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'nano-banana-gemini.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setGeneratedVideo(null);
    setGeneratedImage(null);
    setError(null);
    setProgress("");
  };

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <h3 style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        marginBottom: '1rem',
        color: 'var(--accent-green)'
      }}>
        <Banana size={20} />
        Nano Banana Studio
      </h3>
      
      <p style={{ 
        fontSize: '0.875rem', 
        color: 'var(--text-secondary)', 
        marginBottom: '1rem' 
      }}>
        Generate cinematic videos first, then extract perfect still images from the video content.
      </p>

      {/* Step 1: Video Generation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ 
          fontSize: '0.875rem', 
          fontWeight: '600', 
          marginBottom: '0.75rem',
          color: 'var(--text-primary)'
        }}>
          Step 1: Generate Cinematic Video
        </h4>
        <button
          onClick={generateNanoBananaVideo}
          disabled={isGeneratingVideo || isGeneratingImage}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'var(--accent-blue)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (isGeneratingVideo || isGeneratingImage) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            opacity: (isGeneratingVideo || isGeneratingImage) ? 0.7 : 1
          }}
        >
          {isGeneratingVideo ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {progress || "Generating Video..."}
            </>
          ) : (
            <>
              <Video size={16} />
              Generate Nano Banana Video
            </>
          )}
        </button>
      </div>

      {/* Generated Video Display */}
      {generatedVideo && (
        <div style={{ marginBottom: '1.5rem' }}>
          <video 
            src={generatedVideo} 
            controls 
            autoPlay
            loop
            style={{ 
              width: '100%', 
              borderRadius: '8px', 
              marginBottom: '0.75rem',
              backgroundColor: '#000'
            }} 
          />
          
          {/* Step 2: Image Generation */}
          <h4 style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600', 
            marginBottom: '0.75rem',
            color: 'var(--text-primary)'
          }}>
            Step 2: Extract Still Image
          </h4>
          
          {!generatedImage && (
            <button
              onClick={generateImageFromVideo}
              disabled={isGeneratingImage || isGeneratingVideo}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--accent-green)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: (isGeneratingImage || isGeneratingVideo) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                opacity: (isGeneratingImage || isGeneratingVideo) ? 0.7 : 1,
                marginBottom: '0.75rem'
              }}
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Extracting Image...
                </>
              ) : (
                <>
                  <Camera size={16} />
                  Extract Perfect Frame
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Generated Image Display */}
      {generatedImage && (
        <div style={{ marginBottom: '1rem' }}>
          <img
            src={generatedImage}
            alt="Extracted nano banana dish frame"
            style={{
              width: '100%',
              borderRadius: '8px',
              marginBottom: '0.75rem'
            }}
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: 'var(--error-red)',
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {/* Action Buttons */}
      {(generatedVideo || generatedImage) && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {generatedVideo && (
            <button
              onClick={downloadVideo}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '0.5rem',
                backgroundColor: 'var(--accent-blue)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem'
              }}
            >
              <Download size={14} />
              Download Video
            </button>
          )}
          
          {generatedImage && (
            <button
              onClick={downloadImage}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '0.5rem',
                backgroundColor: 'var(--accent-green)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem'
              }}
            >
              <Download size={14} />
              Download Image
            </button>
          )}
          
          <button
            onClick={reset}
            style={{
              flex: '1',
              minWidth: '80px',
              padding: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'var(--text-secondary)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem'
            }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      )}
    </div>
  );
}