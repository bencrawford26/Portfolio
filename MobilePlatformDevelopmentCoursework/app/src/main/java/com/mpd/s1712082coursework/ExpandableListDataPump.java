package com.mpd.s1712082coursework;

//Ben Crawford - S1712082

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ExpandableListDataPump {
    public static HashMap<String, List<String>> getData(List<String> header, ArrayList<Item> quakeItems, HashMap<String, List<String>> eld) {

        int currentQuake = 0;

        for (Item earthquake : quakeItems) {
            header.add(trimTitle(earthquake.getTitle()));
            List<String> quakeData = new ArrayList<>();

            quakeData.add(earthquake.getOrigin().trim());
            quakeData.add(earthquake.getLocation().trim());
            quakeData.add(earthquake.getLatLon().trim());
            quakeData.add(earthquake.getDepth().trim());
            quakeData.add(earthquake.getMagnitude().trim());
            quakeData.add("Link: " + earthquake.getLink());
            quakeData.add("Date: " + earthquake.getPubDate().toString());
            quakeData.add("Category: " + earthquake.getCategory());
            quakeData.add("Latitude: " + Double.toString(earthquake.getGeoLat()) + " | Longitude: " + Double.toString(earthquake.getGeoLong()));
            eld.put(header.get(currentQuake), quakeData);
            currentQuake++;
        }
        return eld;
    }

    public static HashMap<String, List<String>> getSingleItem(List<String> header, Item quakeItem, HashMap<String, List<String>> eld) {

            header.add(trimTitle(quakeItem.getTitle()));
            List<String> quakeData = new ArrayList<>();

            quakeData.add(quakeItem.getOrigin().trim());
            quakeData.add(quakeItem.getLocation().trim());
            quakeData.add(quakeItem.getLatLon().trim());
            quakeData.add(quakeItem.getDepth().trim());
            quakeData.add(quakeItem.getMagnitude().trim());
            quakeData.add("Link: " + quakeItem.getLink());
            quakeData.add("Date: " + quakeItem.getPubDate().toString());
            quakeData.add("Category: " + quakeItem.getCategory());
            quakeData.add("Latitude: " + Double.toString(quakeItem.getGeoLat()) + " | Longitude: " + Double.toString(quakeItem.getGeoLong()));
            eld.put(header.get(0), quakeData);

        return eld;
    }

    private static String trimTitle(String originalTitle) {
        String temp = originalTitle.replaceAll("UK Earthquake alert : ", "");
        String newTitle = temp.substring(temp.indexOf(":") + 1);
        newTitle.trim();
        return newTitle;
    }

    private static String splitDescription(String description) {
        String[] sections = description.split(";");
        String split = "";
        for (String s : sections) {
            split += s.trim() + "\n";
        }
        return split;
    }
}