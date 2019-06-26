package com.mpd.s1712082coursework;

//Ben Crawford - S1712082

import java.util.Date;

public class Item {

    private String title;
    private String description;
    private String origin;
    private String location;
    private String latLon;
    private String depth;
    private String magnitude;
    private String link;
    private Date pubDate;
    private String category;
    private double geoLat;
    private double geoLong;

    public Item(String title, String description, String origin, String location, String latLon, String depth, String magnitude, String link, Date pubDate, String category, double geoLat, double geoLong) {
        this.title = title;
        this.description = description;
        this.origin = origin;
        this.location = location;
        this.latLon = latLon;
        this.depth = depth;
        this.magnitude = magnitude;
        this.link = link;
        this.pubDate = pubDate;
        this.category = category;
        this.geoLat = geoLat;
        this.geoLong = geoLong;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Date getPubDate() {
        return pubDate;
    }

    public void setPubDate(Date pubDate) {
        this.pubDate = pubDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getGeoLat() {
        return geoLat;
    }

    public void setGeoLat(double geoLat) {
        this.geoLat = geoLat;
    }

    public double getGeoLong() {
        return geoLong;
    }

    public void setGeoLong(double geoLong) {
        this.geoLong = geoLong;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLatLon() {
        return latLon;
    }

    public void setLatLon(String latLon) {
        this.latLon = latLon;
    }

    public String getDepth() {
        return depth;
    }

    public void setDepth(String depth) {
        this.depth = depth;
    }

    public String getMagnitude() {
        return magnitude;
    }

    public void setMagnitude(String magnitude) {
        this.magnitude = magnitude;
    }
}



