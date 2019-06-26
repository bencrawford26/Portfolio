package com.mpd.s1712082coursework;

//Ben Crawford - S1712082

import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.content.DialogInterface;
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
import android.widget.ExpandableListView;
import android.widget.PopupMenu;
import android.widget.Toast;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

public class ListFragment extends Fragment implements View.OnClickListener {
    private static final String TAG = "ListFragment";

    private ExpandableListView listView;
    private ExpandableListAdapter listAdapter;
    private List<String> listDataHeader;
    private HashMap<String, List<String>> expandableListDetail;
    private Button startButton;
    private Button resetListButton;
    private Button filterMenuButton;
    private Button extremeMenuButton;
    private static final String MAIN_ACTIVITY_KEY = "main_activity_key";
    private MainActivity ma;
    private static final String DATA_MANAGER_KEY = "data_manager_key";
    private DataManager dm;
    private ListManager listManager;

    private DatePickerDialog datePickerDialog;

    private ArrayList<Item> quakes;
    private ArrayList<Item> currentList;

    public static ListFragment newInstance(MainActivity ma, DataManager dm) {
        ListFragment listFragment = new ListFragment();

        Bundle bundle = new Bundle();
        bundle.putSerializable(MAIN_ACTIVITY_KEY, ma);
        bundle.putSerializable(DATA_MANAGER_KEY, dm);
        listFragment.setArguments(bundle);

        return listFragment;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.list_fragment, container, false);

        ma = (MainActivity) getArguments().getSerializable(MAIN_ACTIVITY_KEY);
        dm = (DataManager) getArguments().getSerializable(DATA_MANAGER_KEY);

        // Set up the raw links to the graphical components
        startButton = view.findViewById(R.id.startButton);
        startButton.setOnClickListener(this);

        resetListButton = view.findViewById(R.id.resetListButton);
        resetListButton.setOnClickListener(this::resetList);
        resetListButton.setEnabled(false);

        filterMenuButton = view.findViewById(R.id.filterMenuButton);
        filterMenuButton.setOnClickListener(this::showFilterMenu);
        filterMenuButton.setEnabled(false);

        extremeMenuButton = view.findViewById(R.id.extremeMenuButton);
        extremeMenuButton.setOnClickListener(this::showExtremeMenu);
        extremeMenuButton.setEnabled(false);

        listView = view.findViewById(R.id.exList);

        quakes = new ArrayList<>();
        currentList = new ArrayList<>();

        listManager = new ListManager();

        datePickerDialog = new DatePickerDialog(
                getContext(),
                this::onDateSet,
                LocalDateTime.now().minusDays(100).getYear(),
                LocalDateTime.now().minusDays(100).getMonthValue() - 1,
                LocalDateTime.now().minusDays(100).getDayOfMonth()
        );
        datePickerDialog.getDatePicker().setMaxDate(new Date().getTime());

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        expandableListDetail = new HashMap();
        listDataHeader = new ArrayList<String>(expandableListDetail.keySet());
        listAdapter = new ExpandableListAdapter(ma, listDataHeader, expandableListDetail);
        listView.setAdapter(listAdapter);
    }

    public void onClick(View aview) {
        dm.startProgress();
        setList();
    }

    public void setQuakes() {
        quakes = dm.getQuakes();
    }

    public void setList() {
        setQuakes();

        if(quakes == null) {
            (new Handler()).postDelayed(this::setList, 100);
        } else {
            resetListButton.setEnabled(true);
            filterMenuButton.setEnabled(true);
            extremeMenuButton.setEnabled(true);

            currentList = quakes;

            listDataHeader.clear();
            ExpandableListDataPump.getData(listDataHeader, dm.getQuakes(), expandableListDetail);

            listView.invalidateViews();
        }
    }

    public void resetList(View view) {
        listDataHeader.clear();
        ExpandableListDataPump.getData(listDataHeader, dm.getQuakes(), expandableListDetail);
        currentList = quakes;
        listView.invalidateViews();
    }


    public void showFilterMenu(View view){
        PopupMenu popup = new PopupMenu(getContext(), view);
        popup.setOnMenuItemClickListener(this::onFilterMenuItemClick);
        popup.inflate(R.menu.filter_menu);
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

    public void clearList() {
        listDataHeader.clear();
        expandableListDetail.clear();
        ExpandableListAdapter adapter = new ExpandableListAdapter(ma, listDataHeader, expandableListDetail);
        listView.setAdapter(adapter);
    }

    public void onLocationSet(String location) {
        clearList();

        ArrayList<Item> quakesAtLocation = new ArrayList<>();

        for (Item quake : quakes) {
            if (quake.getLocation().contains(location)) {
                quakesAtLocation.add(quake);
            }
        }
        ExpandableListDataPump.getData(listDataHeader, quakesAtLocation, expandableListDetail);
        currentList = quakesAtLocation;
    }

    public void onDateSet(DatePicker datePicker, int i, int i1, int i2) {
        clearList();

        ArrayList<Item> quakesOnDate = new ArrayList<>();

        for (Item quake : quakes) {
            int tempYear = quake.getPubDate().getYear();
            String yearStr = "20" + Integer.toString(tempYear % (int) Math.pow(10, (int) Math.log10(tempYear)));
            int year = Integer.parseInt(yearStr);
            int month = quake.getPubDate().getMonth();
            int day = quake.getPubDate().getDate();


            if (year == i && month == i1 && day == i2) {
                quakesOnDate.add(quake);
            }
        }
        ExpandableListDataPump.getData(listDataHeader, quakesOnDate, expandableListDetail);
        currentList = quakesOnDate;
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
        clearList();

        ArrayList<Item> quakesInRange = new ArrayList<>();

        for (Item quake : quakes) {
            int tempYear = quake.getPubDate().getYear();
            String yearStr = "20" + Integer.toString(tempYear % (int) Math.pow(10, (int) Math.log10(tempYear)));
            int year = Integer.parseInt(yearStr);
            int month = quake.getPubDate().getMonth();
            int day = quake.getPubDate().getDate();
            Log.e("QUAKE DATE", Integer.toString(day) + "/" + Integer.toString(month + 1) + "/" +Integer.toString(year));
            Log.e("Date From:", Integer.toString(d1) + "/" + Integer.toString(m1) + "/" + Integer.toString(y1));
            Log.e("Date To:", Integer.toString(d2) + "/" + Integer.toString(m2) + "/" + Integer.toString(y2));


            if (day >= d1 && day <= d2 && month + 1 >= m1 && month + 1 <= m2 && year >= y1 && year <= y2) {
                quakesInRange.add(quake);
            }
        }
        ExpandableListDataPump.getData(listDataHeader, quakesInRange, expandableListDetail);
        currentList = quakesInRange;
    }


    public void showExtremeMenu(View view) {
        PopupMenu popup = new PopupMenu(getContext(), view);
        popup.setOnMenuItemClickListener(this::onExtremeMenuItemClick);
        popup.inflate(R.menu.extremity_menu);
        popup.show();
    }

    public boolean onExtremeMenuItemClick(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.most_northern:
                clearList();
                listManager.showMostNorthern(currentList, listDataHeader, expandableListDetail);
                return true;
            case R.id.most_southern:
                clearList();
                listManager.showMostSouthern(currentList, listDataHeader, expandableListDetail);
                return true;
            case R.id.most_eastern:
                clearList();
                listManager.showMostEastern(currentList, listDataHeader, expandableListDetail);
                return true;
            case R.id.most_western:
                clearList();
                listManager.showMostWestern(currentList, listDataHeader, expandableListDetail);
                return true;
            case R.id.highest_magnitude:
                clearList();
                listManager.getHighestMag(currentList, listDataHeader, expandableListDetail);
                return true;
            case R.id.lowest_magnitude:
                clearList();
                listManager.getLowestMag(currentList, listDataHeader, expandableListDetail);
                return true;
            case R.id.deepest:
                clearList();
                listManager.getDeepest(currentList, listDataHeader, expandableListDetail);
                return true;
            case R.id.shallowest:
                clearList();
                listManager.getShallowest(currentList, listDataHeader, expandableListDetail);
                return true;
            default:
                return false;
        }
    }
}