package com.gxrv.research_assistant_backend;

public class ResearchRequest {
	private String content;
	private String operation;
	
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public void lombokTest() {
        getContent();
        setContent("test");
    }
}
