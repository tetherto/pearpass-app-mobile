package com.pears.pass.autofill.data;

public class VaultItem {
    private String id;
    private String name;
    private boolean isLocked;
    private String creationDate;

    public VaultItem(String id, String name, boolean isLocked) {
        this.id = id;
        this.name = name;
        this.isLocked = isLocked;
        this.creationDate = null;
    }

    public VaultItem(String id, String name, boolean isLocked, String creationDate) {
        this.id = id;
        this.name = name;
        this.isLocked = isLocked;
        this.creationDate = creationDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isLocked() {
        return isLocked;
    }

    public void setLocked(boolean locked) {
        isLocked = locked;
    }

    public String getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(String creationDate) {
        this.creationDate = creationDate;
    }
}