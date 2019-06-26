package com.mpd.s1712082coursework;

//Ben Crawford - S1712082

import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.content.DialogInterface;
import android.content.res.Configuration;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.PopupMenu;
import android.widget.Toast;


import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;

public class MapFragment extends Fragment implements OnMapReadyCallback, View.OnClickListener, DatePickerDialog.OnDateSetListener {

    private GoogleMap mMap;

    private Button getItemsButton;
    private Button resetMarkersButton;
    private Button filterMenuButton;
    private Button extremeMenuButton;
    private static final String DATA_MANAGER_KEY = "data_manager_key";
    private DataManager dm;
    private MapManager mapManager;

    private ArrayList<Marker> markers;
    private ArrayList<Double> magnitudes;
    private ArrayList<Integer> depths;
    private ArrayList<Item> quakes;

    private DatePickerDialog datePickerDialog;

    public static MapFragment newInstance(DataManager dm) {
        MapFragment mapFragment = new MapFragment();

        Bundle bundle = new Bundle();
        bundle.putSerializable(DATA_MANAGER_KEY, dm);
        mapFragment.setArguments(bundle);

        return mapFragment;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.map_fragment, container, false);

        dm = (DataManager) getArguments().getSerializable(DATA_MANAGER_KEY);

        SupportMapFragment mMapFragment = (SupportMapFragment) getChildFragmentManager().findFragmentById(R.id.map);
        mMapFragment.getMapAsync(this);

        getItemsButton = view.findViewById(R.id.getItemsButton);
        getItemsButton.setOnClickListener(this);

        resetMarkersButton = view.findViewById(R.id.resetMarkersButton);
        resetMarkersButton.setOnClickListener(this::resetMarkers);
        resetMarkersButton.setEnabled(false);

        filterMenuButton = view.findViewById(R.id.filterMenuButton);
        filterMenuButton.setOnClickListener(this::showFilterMenu);
        filterMenuButton.setEnabled(false);

        extremeMenuButton = view.findViewById(R.id.extremeMenuButton);
        extremeMenuButton.setOnClickListener(this::showExtremeMenu);
        extremeMenuButton.setEnabled(false);

        mapManager = new MapManager();

        markers = new ArrayList<>();
        magnitudes = new ArrayList<>();
        depths = new ArrayList<>();

        datePickerDialog = new DatePickerDialog(
                getContext(),
                this,
                LocalDateTime.now().minusDays(100).getYear(),
                LocalDateTime.now().minusDays(100).getMonthValue() - 1,
                LocalDateTime.now().minusDays(100).getDayOfMonth()
        );
        datePickerDialog.getDatePicker().setMaxDate(new Date().getTime());

        return view;
    }

    @Override
    public void onClick(View view) {
        dm.startProgress();
        setStartingMarkers();
    }

    public void showFilterMenu(View view) {
        PopupMenu popup = new PopupMenu(getContext(), view);
        popup.setOnMenuItemClickListener(this::onFilterMenuItemClick);
        popup.inflate(R.menu.filter_menu);
        popup.show();
    }

    public void showExtremeMenu(View view) {
        PopupMenu popup = new PopupMenu(getContext(), view);
        popup.setOnMenuItemClickListener(this::onExtremeMenuItemClick);
        popup.inflate(R.menu.extremity_menu);
        popup.show();
    }

    public boolean onFilterMenuItemClick(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.search_area:
                showAreaDialog();
                return true;
            case R.id.search_date:
                datePickerDialog.show();
                return true;
            case R.id.date_range:
                showDateRangeDialog();
                return true;
            default:
                return false;
        }
    }

    public void showAreaDialog() {
        ArrayList<String> locations = setLocations();
        String[] locs = locations.toArray(new String[0]);

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());

        builder.setTitle("Set area to search in:")
                .setItems(locs, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        onLocationSet(locs[which]);
                    }
                });

        builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                // User cancelled the dialog
            }
        });

        AlertDialog dialog = builder.create();
        dialog.show();
    }

    public ArrayList<String> setLocations() {
        ArrayList<String> locs = new ArrayList<>();
        for (Item quake : quakes) {
            String trimmedLocation = quake.getLocation().replaceAll("Location: ", "");
            if (!locs.contains(trimmedLocation)) {
                locs.add(trimmedLocation);
            }
        }
        return locs;
    }

    public void onLocationSet(String location) {
        mMap.clear();
        markers.clear();
        magnitudes.clear();
        depths.clear();

        for (Item quake : quakes) {
            if (quake.getLocation().contains(location)) {
                markers.add(mapManager.setMarker(quake, magnitudes, depths, mMap, getContext()));
                Log.d("MARKERS:", Integer.toString(markers.size()));
            }
        }
    }

    @Override
    public void onDateSet(DatePicker datePicker, int i, int i1, int i2) {
        mMap.clear();
        markers.clear();
        magnitudes.clear();
        depths.clear();

        for (Item quake : quakes) {
            int tempYear = quake.getPubDate().getYear();
            String yearStr = "20" + Integer.toString(tempYear % (int) Math.pow(10, (int) Math.log10(tempYear)));
            int year = Integer.parseInt(yearStr);
            int month = quake.getPubDate().getMonth();
            int day = quake.getPubDate().getDate();


            if (year == i && month == i1 && day == i2) {
                markers.add(mapManager.setMarker(quake, magnitudes, depths, mMap, getContext()));
                Log.d("MARKERS:", Integer.toString(markers.size()));
            }
        }
    }

    public void showDateRangeDialog() {

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());

        // Get the layout inflater
        LayoutInflater inflater = requireActivity().getLayoutInflater();

        // Inflate and set the layout for the dialog
        // Pass null as the parent view because its going in the dialog layout
        View dateRangeView = inflater.inflate(R.layout.date_range, null);
        builder.setView(dateRangeView)
                .setTitle("Set date range")
                // Add action buttons
                .setPositiveButton("Confirm", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                        checkDates(dateRangeView);
                    }
                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                    }
                });
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    public void checkDates(View dateRangeView) {
        EditText day1 = dateRangeView.findViewById(R.id.day_1);
        String day1Str = day1.getText().toString();

        EditText month1 = dateRangeView.findViewById(R.id.month_1);
        String month1Str = month1.getText().toString();

        EditText year1 = dateRangeView.findViewById(R.id.year_1);
        String year1Str = year1.getText().toString();

        EditText day2 = dateRangeView.findViewById(R.id.day_2);
        String day2Str = day2.getText().toString();

        EditText month2 = dateRangeView.findViewById(R.id.month_2);
        String month2Str = month2.getText().toString();

        EditText year2 = dateRangeView.findViewById(R.id.year_2);
        String year2Str = year2.getText().toString();


        if (day1Str.isEmpty() || month1Str.isEmpty() || year1Str.isEmpty() || day2Str.isEmpty() || month2Str.isEmpty() || year2Str.isEmpty()) {
            Toast.makeText(getActivity(), "All fields must have a value",
                    Toast.LENGTH_SHORT).show();
        } else {
            int day1Int = Integer.parseInt(day1Str);
            int month1Int = Integer.parseInt(month1Str);
            int year1Int = Integer.parseInt(year1Str);

            int day2Int = Integer.parseInt(day2Str);
            int month2Int = Integer.parseInt(month2Str);
            int year2Int = Integer.parseInt(year2Str);
            onDateRangeSet(day1Int, month1Int, year1Int, day2Int, month2Int, year2Int);
        }
    }

    public void onDateRangeSet(int d1, int m1, int y1, int d2, int m2, int y2) {
        mMap.clear();
        markers.clear();
        magnitudes.clear();
        depths.clear();

        for (Item quake : quakes) {
            int tempYear = quake.getPubDate().getYear();
            String yearStr = "20" + Integer.toString(tempYear % (int) Math.pow(10, (int) Math.log10(tempYear)));
            int year = Integer.parseInt(yearStr);
            int month = quake.getPubDate().getMonth();
            int day = quake.getPubDate().getDate();


            if (day >= d1 && day <= d2 && month + 1 >= m1 && month + 1 <= m2 && year >= y1 && year <= y2) {
                markers.add(mapManager.setMarker(quake, magnitudes, depths, mMap, getContext()));
                Log.d("MARKERS:", Integer.toString(markers.size()));
            }
        }

    }

    public boolean onExtremeMenuItemClick(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.most_northern:
                mapManager.showMostNorthern(markers, mMap);
                return true;
            case R.id.most_southern:
                mapManager.showMostSouthern(markers, mMap);
                return true;
            case R.id.most_eastern:
                mapManager.showMostEastern(markers, mMap);
                return true;
            case R.id.most_western:
                mapManager.showMostWestern(markers, mMap);
                return true;
            case R.id.highest_magnitude:
                mapManager.getHighestMag(magnitudes, markers, mMap);
                return true;
            case R.id.lowest_magnitude:
                mapManager.getLowestMag(magnitudes, markers, mMap);
                return true;
            case R.id.deepest:
                mapManager.getDeepest(depths, markers, mMap);
                return true;
            case R.id.shallowest:
                mapManager.getShallowest(depths, markers, mMap);
                return true;
            default:
                return false;
        }
    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        int orientation = getResources().getConfiguration().orientation;
        if (orientation == Configuration.ORIENTATION_LANDSCAPE) {
            // Centre map camera on the UK
            mMap.moveCamera(CameraUpdateFactory.zoomTo((float) 4.5));
        } else {
            // Centre map camera on the UK
            mMap.moveCamera(CameraUpdateFactory.zoomTo((float) 5.5));
        }
        LatLng centralUK = new LatLng(54.507320, -3.825141);
        mMap.moveCamera(CameraUpdateFactory.newLatLng(centralUK));
    }

    public void setQuakes() {
        quakes = dm.getQuakes();
    }

    public void setStartingMarkers() {
        setQuakes();
        if (quakes == null) {
            (new Handler()).postDelayed(this::setStartingMarkers, 100);
        } else {
            filterMenuButton.setEnabled(true);
            extremeMenuButton.setEnabled(true);
            resetMarkersButton.setEnabled(true);
            markers.clear();
            magnitudes.clear();
            depths.clear();


            for (Item quake : quakes) {
                markers.add(mapManager.setMarker(quake, magnitudes, depths, mMap, getContext()));
            }
        }
    }

    public void resetMarkers(View view) {
        markers.clear();
        magnitudes.clear();
        depths.clear();

        int orientation = getResources().getConfiguration().orientation;

        if (orientation == Configuration.ORIENTATION_LANDSCAPE) {
            mMap.moveCamera(CameraUpdateFactory.zoomTo((float) 4.5));
        } else {
            mMap.moveCamera(CameraUpdateFactory.zoomTo((float) 5.5));
        }
        LatLng centralUK = new LatLng(54.507320, -3.825141);
        mMap.moveCamera(CameraUpdateFactory.newLatLng(centralUK));

        for (Item quake : quakes) {
            markers.add(mapManager.setMarker(quake, magnitudes, depths, mMap, getContext()));
        }
    }

}
