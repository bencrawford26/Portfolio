package com.mpd.s1712082coursework;

//Ben Crawford - S1712082

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ListManager {

    public void showMostNorthern(ArrayList<Item> listData, List<String> header, HashMap<String, List<String>> hashMap) {
        Item northern = listData.get(0);
        for (Item quake : listData) {
            if (quake.getGeoLat() > northern.getGeoLat()) {
                northern = quake;
            }
        }
        ExpandableListDataPump.getSingleItem(header, northern, hashMap);
    }

    public void showMostSouthern(ArrayList<Item> listData, List<String> header, HashMap<String, List<String>> hashMap) {
        Item southern = listData.get(0);
        for (Item quake : listData) {
            if (quake.getGeoLat() < southern.getGeoLat()) {
                southern = quake;
            }
        }
        ExpandableListDataPump.getSingleItem(header, southern, hashMap);
    }

    public void showMostEastern(ArrayList<Item> listData, List<String> header, HashMap<String, List<String>> hashMap) {
        Item eastern = listData.get(0);
        for (Item quake : listData) {
            if (quake.getGeoLong() > eastern.getGeoLong()) {
                eastern = quake;
            }
        }
        ExpandableListDataPump.getSingleItem(header, eastern, hashMap);
    }
    
    public void showMostWestern(ArrayList<Item> listData, List<String> header, HashMap<String, List<String>> hashMap) {
        Item western = listData.get(0);
        for (Item quake : listData) {
            if (quake.getGeoLong() < western.getGeoLong()) {
                western = quake;
            }
        }
        ExpandableListDataPump.getSingleItem(header, western, hashMap);

    }

    public void getHighestMag(ArrayList<Item> listData, List<String> header, HashMap<String, List<String>> hashMap) {
        Item highestMagItem = listData.get(0);

        for (Item quake : listData) {
            String trimmedMag = highestMagItem.getMagnitude().replaceAll("Magnitude: ", "");
            double highestMag = Double.parseDouble(trimmedMag);


            String trimmedMagCurrent = quake.getMagnitude().replaceAll("Magnitude: ", "");
            double magCurrent = Double.parseDouble(trimmedMagCurrent);

            if (magCurrent > highestMag) {
                highestMagItem = quake;
            }
        }
        ExpandableListDataPump.getSingleItem(header, highestMagItem, hashMap);

    }

    public void getLowestMag(ArrayList<Item> listData, List<String> header, HashMap<String, List<String>> hashMap) {
        Item lowestMagItem = listData.get(0);

        for (Item quake : listData) {
            String trimmedMag = lowestMagItem.getMagnitude().replaceAll("Magnitude: ", "");
            double highestMag = Double.parseDouble(trimmedMag);


            String trimmedMagCurrent = quake.getMagnitude().replaceAll("Magnitude: ", "");
            double magCurrent = Double.parseDouble(trimmedMagCurrent);

            if (magCurrent < highestMag) {
                lowestMagItem = quake;
            }
        }
        ExpandableListDataPump.getSingleItem(header, lowestMagItem, hashMap);

    }

    public void getDeepest(ArrayList<Item> listData, List<String> header, HashMap<String, List<String>> hashMap) {
        Item deepestItem = listData.get(0);

        for (Item quake : listData) {
            String trimmedDepth = deepestItem.getDepth().replaceAll("Depth: ", "");
            String trimmedDepth1 = trimmedDepth.replaceAll("km", "");
            double highestDepth = Double.parseDouble(trimmedDepth1);


            String trimmedDepthCurrent = quake.getDepth().replaceAll("Depth: ", "");
            String trimmedDepthCurrent1 = trimmedDepthCurrent.replaceAll("km", "");
            double depthCurrent = Double.parseDouble(trimmedDepthCurrent1);


            if (depthCurrent > highestDepth) {
                deepestItem = quake;
            }
        }
        ExpandableListDataPump.getSingleItem(header, deepestItem, hashMap);

    }

    public void getShallowest(ArrayList<Item> listData, List<String> header, HashMap<String, List<String>> hashMap) {
        Item shallowestItem = listData.get(0);

        for (Item quake : listData) {
            String trimmedDepth = shallowestItem.getDepth().replaceAll("Depth: ", "");
            String trimmedDepth1 = trimmedDepth.replaceAll("km", "");
            double lowestDepth = Double.parseDouble(trimmedDepth1);


            String trimmedDepthCurrent = quake.getDepth().replaceAll("Depth: ", "");
            String trimmedDepthCurrent1 = trimmedDepthCurrent.replaceAll("km", "");
            double depthCurrent = Double.parseDouble(trimmedDepthCurrent1);

            if (depthCurrent < lowestDepth) {
                shallowestItem = quake;
            }
        }
        ExpandableListDataPump.getSingleItem(header, shallowestItem, hashMap);

    }
}
