package com.mpd.s1712082coursework;

//Ben Crawford - S1712082

import android.app.Activity;
import android.app.ProgressDialog;
import android.graphics.Bitmap;
import android.os.AsyncTask;
import android.util.Log;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Serializable;
import java.io.StringReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Date;

public class DataManager implements Serializable {

    private String result;
    private String urlSource = "http://quakes.bgs.ac.uk/feeds/MhSeismology.xml";
    private MainActivity ma;
    ProgressDialog p;
    private ArrayList<Item> quakes;

    public DataManager(MainActivity ma) {
        this.ma = ma;
    }

    public void startProgress() {
        Task asyncTask = new Task(urlSource);
        asyncTask.execute();
    }

    public ArrayList<Item> getQuakes() {
        return quakes;
    }

    public ArrayList<Item> parseData(String res) throws XmlPullParserException, IOException {
        Item earthquakeItem = new Item("", "", "", "", "", "", "", "", new Date(), "", 0, 0);
        quakes = null;

        try {
            XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
            factory.setNamespaceAware(true);
            XmlPullParser xpp = factory.newPullParser();
            xpp.setInput(new StringReader(res));
            int eventType = xpp.getEventType();

            while (eventType != XmlPullParser.END_DOCUMENT) {
                //Initialize new item to be added to list
                if (eventType == XmlPullParser.START_TAG) {

                    //check current tag
                    if (xpp.getName().equalsIgnoreCase("channel")) {
                        quakes = new ArrayList<>();

                    } else if (xpp.getName().equalsIgnoreCase("item")) {
                        earthquakeItem = new Item("", "", "", "", "", "", "", "", new Date(), "", 0, 0);

                    } else if (xpp.getName().equalsIgnoreCase("title")) {
                        earthquakeItem.setTitle(xpp.nextText());

                    } else if (xpp.getName().equalsIgnoreCase("description")) {
                        earthquakeItem.setDescription(xpp.nextText());
                        String[] split = splitDescription(earthquakeItem.getDescription(), earthquakeItem);
                        earthquakeItem.setOrigin(split[0]);
                        earthquakeItem.setLocation(split[1]);
                        earthquakeItem.setLatLon(split[2]);
                        earthquakeItem.setDepth(split[3]);
                        earthquakeItem.setMagnitude(split[4]);


                    } else if (xpp.getName().equalsIgnoreCase("link")) {
                        earthquakeItem.setLink(xpp.nextText());

                    } else if (xpp.getName().equalsIgnoreCase("pubDate")) {
                        earthquakeItem.setPubDate(new Date(xpp.nextText()));

                    } else if (xpp.getName().equalsIgnoreCase("category")) {
                        earthquakeItem.setCategory(xpp.nextText());

                    } else if (xpp.getName().equalsIgnoreCase("lat")) {
                        earthquakeItem.setGeoLat(Double.parseDouble(xpp.nextText()));

                    } else if (xpp.getName().equalsIgnoreCase("long")) {
                        earthquakeItem.setGeoLong(Double.parseDouble(xpp.nextText()));
                    }


                } else if (eventType == XmlPullParser.END_TAG) {
                    if (xpp.getName().equalsIgnoreCase("item")) {
                        quakes.add(earthquakeItem);
                    }
                }
                eventType = xpp.next();
            }
        } catch (XmlPullParserException ae1) {
            Log.e("MyTag", "Parsing error" + ae1.toString());
        } catch (IOException ae1) {
            Log.e("MyTag", "IO error during parsing");
        }
        return quakes;

    }

    private static String[] splitDescription(String description, Item quake) {
        String[] sections = description.split(";");
        String[] empty = new String[5];
        if (sections.length < 5) sections = empty;
        return sections;
    }

    private class Task extends AsyncTask<URL, Integer, String> {
        private String url;

        public Task(String aurl) {
            url = aurl;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            p = new ProgressDialog(ma);
            p.setMessage("Fetching earthquake data...");
            p.setIndeterminate(false);
            p.setCancelable(false);
            p.show();
        }

        @Override
        protected String doInBackground(URL... urls) {
            URL aurl;
            URLConnection yc;
            BufferedReader in = null;
            String inputLine = "";

            try {
                Log.e("TRYING", "PULL DATA");
                aurl = new URL(url);
                yc = aurl.openConnection();
                in = new BufferedReader(new InputStreamReader(yc.getInputStream()));
                // Throw away the first 2 header lines before parsing
                while ((inputLine = in.readLine()) != null) {
                    result = result + inputLine;
                    Log.e("XML DATA:", inputLine);

                }
                in.close();
            } catch (IOException ae) {
                Log.e("MyTag", "ioexception");
            }
            return result;
        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);

            p.hide();

            // Now that you have the xml data you can parse it
            if (result.contains("null")) {
                result = result.replace("null", "");
            }

            ma.runOnUiThread(() -> {
                ArrayList<Item> earthQuakeItems = null;

                try {
                    earthQuakeItems = parseData(result);
                } catch (XmlPullParserException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });

        }
    }
}
