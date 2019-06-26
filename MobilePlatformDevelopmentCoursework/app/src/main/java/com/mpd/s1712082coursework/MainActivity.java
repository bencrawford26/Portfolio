package com.mpd.s1712082coursework;

//Ben Crawford - S1712082

import android.support.design.widget.TabLayout;
import android.support.v7.app.AppCompatActivity;

import android.support.v4.view.ViewPager;
import android.os.Bundle;

import java.io.Serializable;

public class MainActivity extends AppCompatActivity implements Serializable {

    private static final String TAG = "MainActivity";

    private SectionsPageAdapter mSectionsPageAdapter;
    private DataManager dataManager;

    private ViewPager mViewPager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mSectionsPageAdapter = new SectionsPageAdapter(getSupportFragmentManager());

        dataManager = new DataManager(this);

        // set up the viewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.container);
        setupViewPager(mViewPager);

        TabLayout tabLayout = (TabLayout) findViewById(R.id.tabs);
        tabLayout.setupWithViewPager(mViewPager);
    }

    private void setupViewPager(ViewPager viewPager) {
        SectionsPageAdapter adapter = new SectionsPageAdapter((getSupportFragmentManager()));

        adapter.addFragment(ListFragment.newInstance(this, dataManager), "List View");
        adapter.addFragment(MapFragment.newInstance(dataManager), "Map View");

        viewPager.setAdapter(adapter);
    }

}
