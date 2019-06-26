package com.mpd.s1712082coursework;

//Ben Crawford - S1712082

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import java.util.ArrayList;

public class MapManager {

    public void showMostNorthern(ArrayList<Marker> markers, GoogleMap mMap) {
        Marker northern = markers.get(0);
        for (Marker marker : markers) {
            if (marker.getPosition().latitude > northern.getPosition().latitude) {
                northern = marker;
            }
        }
        mMap.moveCamera(CameraUpdateFactory.newLatLng(northern.getPosition()));
        northern.showInfoWindow();
    }

    public void showMostSouthern(ArrayList<Marker> markers, GoogleMap mMap) {
        Marker southern = markers.get(0);
        for (Marker marker : markers) {
            if (marker.getPosition().latitude < southern.getPosition().latitude) {
                southern = marker;
            }
        }
        mMap.moveCamera(CameraUpdateFactory.newLatLng(southern.getPosition()));
        southern.showInfoWindow();
    }

    public void showMostEastern(ArrayList<Marker> markers, GoogleMap mMap) {
        Marker eastern = markers.get(0);
        for (Marker marker : markers) {
            if (marker.getPosition().longitude > eastern.getPosition().longitude) {
                eastern = marker;
            }
        }
        mMap.moveCamera(CameraUpdateFactory.newLatLng(eastern.getPosition()));
        eastern.showInfoWindow();
    }

    public void showMostWestern(ArrayList<Marker> markers, GoogleMap mMap) {
        Marker western = markers.get(0);
        for (Marker marker : markers) {
            if (marker.getPosition().longitude < western.getPosition().longitude) {
                western = marker;
            }
        }
        mMap.moveCamera(CameraUpdateFactory.newLatLng(western.getPosition()));
        western.showInfoWindow();
    }

    public void getHighestMag(ArrayList<Double> magnitudes, ArrayList<Marker> markers, GoogleMap mMap) {
        double highest = magnitudes.get(0);
        String preText = "";
        for (double mag : magnitudes) {
            if (mag > highest) {
                highest = mag;
                Log.d("HIGHEST MAG", Double.toString(highest));
            }
        }

        if(highest < 0) {
            preText = "Magnitude: ";
        } else {
            preText = "Magnitude:  ";
        }

        for (Marker marker : markers) {
            Log.e("MARKER", marker.getSnippet());
            if (marker.getSnippet().contains(preText + Double.toString(highest))) {
                Log.e("MARKER FOUND", marker.getSnippet());
                mMap.moveCamera(CameraUpdateFactory.newLatLng(marker.getPosition()));
                marker.showInfoWindow();
            }
        }
    }

    public void getLowestMag(ArrayList<Double> magnitudes, ArrayList<Marker> markers, GoogleMap mMap) {
        double lowest = magnitudes.get(0);
        String preText = "";
        for (double mag : magnitudes) {
            if (mag < lowest) {
                lowest = mag;
                Log.d("LOWEST MAG", Double.toString(lowest));
            }
        }

        if(lowest < 0) {
            preText = "Magnitude: ";
        } else {
            preText = "Magnitude:  ";
        }

        for (Marker marker : markers) {
            if (marker.getSnippet().contains(preText + Double.toString(lowest))) {
                Log.e("MARKER FOUND", marker.getSnippet());
                mMap.moveCamera(CameraUpdateFactory.newLatLng(marker.getPosition()));
                marker.showInfoWindow();
            }
        }
    }

    public void getDeepest(ArrayList<Integer> depths, ArrayList<Marker> markers, GoogleMap mMap) {
        int deepest = depths.get(0);

        for (int depth : depths) {
            if (depth > deepest) {
                deepest = depth;
                Log.d("DEEPEST", Double.toString(deepest));
            }
        }

        for (Marker marker : markers) {
            if (marker.getSnippet().contains(Integer.toString(deepest) + " km")) {
                Log.e("MARKER FOUND", marker.getSnippet());
                mMap.moveCamera(CameraUpdateFactory.newLatLng(marker.getPosition()));
                marker.showInfoWindow();
            }
        }
    }

    public void getShallowest(ArrayList<Integer> depths, ArrayList<Marker> markers, GoogleMap mMap) {
        int shallowest = depths.get(0);

        for (int depth : depths) {
            if (depth < shallowest) {
                shallowest = depth;
                Log.d("DEEPEST", Double.toString(shallowest));
            }
        }

        for (Marker marker : markers) {
            if (marker.getSnippet().contains(Integer.toString(shallowest) + " km")) {
                Log.e("MARKER FOUND", marker.getSnippet());
                mMap.moveCamera(CameraUpdateFactory.newLatLng(marker.getPosition()));
                marker.showInfoWindow();
            }
        }
    }


    public Marker setMarker(Item quake, ArrayList<Double> magnitudes, ArrayList<Integer> depths, GoogleMap mMap, Context context) {
        MarkerOptions options = new MarkerOptions();
        options.position(new LatLng(quake.getGeoLat(), quake.getGeoLong()));
        options.title(setTitle(quake.getLocation()));
        options.snippet(quake.getOrigin() + "\n" + quake.getLocation().trim() +
                "\n" + quake.getLatLon().trim() + "\n" + quake.getDepth().trim() + "\n" +
                quake.getMagnitude().trim() + "\n" + quake.getLink().trim());
        options.icon(setColor(quake.getMagnitude()));

        String trimmedMag = quake.getMagnitude().replaceAll("Magnitude: ", "");
        double mag = Double.parseDouble(trimmedMag);

        magnitudes.add(mag);

        String trimmedDepth = quake.getDepth().replaceAll("Depth: ", "");
        String trimmedDepth1 = trimmedDepth.replaceAll("km", "");
        int depth = Integer.parseInt(trimmedDepth1.trim());

        depths.add(depth);

        Marker m = mMap.addMarker(options);

        GoogleMap.InfoWindowAdapter infoWindowAdapter = new GoogleMap.InfoWindowAdapter() {
            @Override
            public View getInfoWindow(Marker marker) {
                return null;
            }

            @Override
            public View getInfoContents(Marker marker) {
                LinearLayout info = new LinearLayout(context);
                info.setOrientation(LinearLayout.VERTICAL);

                TextView title = new TextView(context);
                title.setTextColor(Color.BLACK);
                title.setGravity(Gravity.CENTER);
                title.setTypeface(null, Typeface.BOLD);
                title.setText(marker.getTitle());

                TextView snippet = new TextView(context);
                snippet.setText(marker.getSnippet());

                info.addView(title);
                info.addView(snippet);

                return info;
            }
        };
        mMap.setInfoWindowAdapter(infoWindowAdapter);
        return m;
    }

    public com.google.android.gms.maps.model.BitmapDescriptor setColor(String mag) {
        String temp = mag.replaceAll("Magnitude: ", "");
        Double magnitude = Double.parseDouble(temp);
        if (magnitude < -0.5) {
            return BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE);
        } else if (magnitude >= -0.5 && magnitude <= 0) {
            return BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE);
        } else if (magnitude > 0 && magnitude <= 0.5) {
            return BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_CYAN);
        } else if (magnitude > 0.5 && magnitude <= 1) {
            return BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN);
        } else if (magnitude > 1 && magnitude <= 1.5) {
            return BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_YELLOW);
        } else if (magnitude > 1.5 && magnitude <= 2) {
            return BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_ORANGE);
        } else if (magnitude > 2 && magnitude <= 2.5) {
            return BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_MAGENTA);
        } else if (magnitude > 2.5 && magnitude <= 3) {
            return BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_VIOLET);
        } else {
            return BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED);
        }
    }

    public String setTitle(String location) {
        String temp = location.replaceAll("Location: ", "");
        String[] splitLocation = temp.split(",");
        splitLocation[0] += ",";

        String title = "UK Earthquake alert : ";
        for (String s : splitLocation) {
            String lower = s.toLowerCase().trim();
            String cap = lower.substring(0, 1).toUpperCase() + lower.substring(1);
            title += cap;
        }

        return title;
    }

}
