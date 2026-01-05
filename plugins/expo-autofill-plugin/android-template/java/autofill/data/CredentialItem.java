package com.pears.pass.autofill.data;

import java.util.List;
import java.util.ArrayList;

public class CredentialItem {
    private String id;
    private String title;
    private String username;
    private String password;
    private String url;
    private String notes;
    private List<String> websites;

    public CredentialItem(String id, String title, String username, String password) {
        this.id = id;
        this.title = title;
        this.username = username;
        this.password = password;
        this.websites = new ArrayList<>();
    }

    public CredentialItem(String id, String title, String username, String password, List<String> websites) {
        this.id = id;
        this.title = title;
        this.username = username;
        this.password = password;
        this.websites = websites != null ? websites : new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<String> getWebsites() {
        return websites;
    }

    public void setWebsites(List<String> websites) {
        this.websites = websites != null ? websites : new ArrayList<>();
    }
}