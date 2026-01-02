package com.gxrv.research_assistant_backend;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GeminiResponse {
	private List<Candidate> candidates;
	
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class Candidate {
		private Content content;

		public Content getContent() {
			return content;
		}

		public void setContent(Content content) {
			this.content = content;
		}

		public Candidate(Content content) {
			this.content = content;
		}

		@Override
		public String toString() {
			return "Candidate [content=" + content + "]";
		}
	}
	
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class Content {
		private List<Part> parts;

		public List<Part> getParts() {
			return parts;
		}

		public void setParts(List<Part> parts) {
			this.parts = parts;
		}

		public Content(List<Part> parts) {
			this.parts = parts;
		}

		@Override
		public String toString() {
			return "Content [parts=" + parts + "]";
		}
	}
	
	@JsonIgnoreProperties(ignoreUnknown = true)
	public static class Part {
		private String text;

		public String getText() {
			return text;
		}

		public void setText(String text) {
			this.text = text;
		}

		public Part(String text) {
			this.text = text;
		}

		@Override
		public String toString() {
			return "Part [text=" + text + "]";
		} 
	}

	public List<Candidate> getCandidates() {
		return candidates;
	}

	public void setCandidates(List<Candidate> candidates) {
		this.candidates = candidates;
	}

	public GeminiResponse(List<Candidate> candidates) {
		this.candidates = candidates;
	}

	@Override
	public String toString() {
		return "GeminiResponse [candidateList=" + candidates + "]";
	}
	
	
}
