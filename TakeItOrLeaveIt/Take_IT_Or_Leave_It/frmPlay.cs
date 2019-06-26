using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Take_IT_Or_Leave_It
{
    public partial class frmPlay : Form
    {
        double[] winningsList = new double[] { .01, .10, .50, 1, 10, 25, 50, 75, 100, 1000, 10000, 25000, 50000, 75000, 100000, 150000, 200000, 250000 };       //creates the list of potential winnings
        double[] winningsShuffled;      //holds the values of winningsList in a random order
        bool firstBox = true;
        double firstBoxMoney = 0;
        System.Windows.Forms.Button[] boxBtn;
        System.Windows.Forms.Label[] lblArrayL;
        System.Windows.Forms.Label[] lblArrayR;
        private Random randomNo = new Random();
        int boxesChosen = 0;
        int boxesRemaining = 18;
        double offer;
        
        public frmPlay()
        {
            InitializeComponent();
        }

        private void frmPlay_Load(object sender, EventArgs e)
        {
            displayWinningsL();
            displayWinningsR();
            winningsShuffled = FisherYates(winningsList);
            displayBoxes();
        }
        
        private void displayBoxes()
        {
            int xPos = 0, yPos = 0;
            boxBtn = new System.Windows.Forms.Button[18];       //creates an array of 18 buttons

            for (int i = 0; i < 18; i++)        //sets the way the boxes will look
            {
                boxBtn[i] = new Button();
                boxBtn[i].Size = new Size(100, 100);
                boxBtn[i].Location = new Point(xPos, yPos);
                boxBtn[i].BackColor = System.Drawing.Color.Crimson;
                boxBtn[i].Font = new System.Drawing.Font("Microsoft Sans Serif", 16F, System.Drawing.FontStyle.Bold);
                boxBtn[i].ForeColor = System.Drawing.Color.White;
                boxBtn[i].Text = (i + 1).ToString();
         
                if ((i == 3))       //sets a new line of buttons
                {
                    xPos = 0;
                    yPos = yPos + 120;
                }
                if ((i == 6))       //shifts buttons over to the right
                {
                    xPos = 735;
                    yPos = 0;
                }
                if ((i == 9))
                {
                    xPos = 735;
                    yPos = yPos + 120;
                }
                if ((i == 12))
                {
                    xPos = 220;
                    yPos = yPos + 140;
                }
                boxBtn[i].Left = xPos;
                boxBtn[i].Top = yPos;

                //Adds boxes to Panel
                boxPanel.Controls.Add(boxBtn[i]);
                xPos = xPos + boxBtn[i].Width;

                //links new buttons click event to pickBox
                boxBtn[i].Click += new System.EventHandler(pickBox);
            }
        }

        private void displayWinningsL()     //creates the left panel of winnings
        {
            int xPos = 0, yPos = 0;
            lblArrayL = new Label[9];       //creates an array of 9 labels

            for (int i = 0; i < 9; i++)     //sets the way labels will look
            {
                if (i < 3)
                {
                    lblArrayL[i] = new Label();
                    lblArrayL[i].Size = new Size(150, 30);
                    lblArrayL[i].Location = new Point(xPos, yPos);
                    lblArrayL[i].BackColor = System.Drawing.Color.Blue;
                    lblArrayL[i].Font = new System.Drawing.Font("Microsoft Sans Serif", 18F, System.Drawing.FontStyle.Bold);
                    lblArrayL[i].ForeColor = System.Drawing.Color.White;
                    lblArrayL[i].TextAlign = ContentAlignment.MiddleCenter;
                    lblArrayL[i].Text = winningsList[i].ToString("C");
                }
                else
                {
                    lblArrayL[i] = new Label();
                    lblArrayL[i].Size = new Size(150, 30);
                    lblArrayL[i].Location = new Point(xPos, yPos);
                    lblArrayL[i].BackColor = System.Drawing.Color.Blue;
                    lblArrayL[i].Font = new System.Drawing.Font("Microsoft Sans Serif", 18F, System.Drawing.FontStyle.Bold);
                    lblArrayL[i].ForeColor = System.Drawing.Color.White;
                    lblArrayL[i].TextAlign = ContentAlignment.MiddleCenter;
                    lblArrayL[i].Text = winningsList[i].ToString("C0");
                }

                if ((i == 1))       //sets each item on a new row
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 2))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 3))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 4))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 5))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 6))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 7))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 8))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }

                lblArrayL[i].Left = xPos;
                lblArrayL[i].Top = yPos;

                //Adds items to Panel
                winningsL.Controls.Add(lblArrayL[i]);
                xPos = xPos + lblArrayL[i].Width;
            }
        }

        private void displayWinningsR()     //creates the right panel of winnings
        {
            int xPos = 0, yPos = 0;

            lblArrayR = new Label[9];

            for (int i = 0; i < 9; i++)
            {
                lblArrayR[i] = new Label();
                lblArrayR[i].Size = new Size(150, 30);
                lblArrayR[i].Location = new Point(xPos, yPos);
                lblArrayR[i].BackColor = System.Drawing.Color.Crimson;
                lblArrayR[i].Font = new System.Drawing.Font("Microsoft Sans Serif", 18F, System.Drawing.FontStyle.Bold);
                lblArrayR[i].ForeColor = System.Drawing.Color.White;
                lblArrayR[i].TextAlign = ContentAlignment.MiddleCenter;
                lblArrayR[i].Text = winningsList[i + 9].ToString("C0");

                if ((i == 1))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 2))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 3))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 4))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 5))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 6))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 7))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }
                if ((i == 8))
                {
                    xPos = 0;
                    yPos = yPos + 31;
                }

                lblArrayR[i].Left = xPos;
                lblArrayR[i].Top = yPos;

                //Adds boxes to Panel
                winningsR.Controls.Add(lblArrayR[i]);
                xPos = xPos + lblArrayR[i].Width;
            }
        }

        private void btnExit_Click(object sender, EventArgs e)
        {
            Application.Exit();     //exits the game
        }

        private double[] FisherYates(double[] array)
        {
            Random r = new Random();
            for (int i = array.Length - 1; i > 0; i--)
            {
                int index = r.Next(i);
                double tmp = array[index]; //swap
                array[index] = array[i];
                array[i] = tmp;
            }
            return array;
        }

        public void pickBox(object sender, EventArgs e)
        {
            Button btn = (Button)sender;
            int boxNo = int.Parse(btn.Text) - 1;
            double moneyValue = winningsShuffled[boxNo];

            for (int i = 0; i < 18; i++)
            {
                btn.Tag = moneyValue.ToString();
                boxBtn[i].Tag = btn.Tag;
            }

            if (firstBox == true)       //sets the first box aside as the players
            {
                firstBox = false;
                lblYourBox.Text = btn.Text;
                btn.Enabled = false;
                lblYourBox.Size = new Size(80, 80);
                lblYourBox.BackColor = System.Drawing.Color.Crimson;
                lblYourBox.Font = new System.Drawing.Font("Microsoft Sans Serif", 16F, System.Drawing.FontStyle.Bold);
                lblYourBox.ForeColor = System.Drawing.Color.White;
                lblYourBox.Tag = btn.Tag.ToString();
                firstBoxMoney = winningsShuffled[boxNo];
                boxesRemaining--;
                MessageBox.Show("Now choose the first 3 boxes you would like to eliminate from play.");
            }

            else        //disables chosen box and displays contents
            {
                btn.Text = btn.Tag.ToString();
                btn.Enabled = false;
                btn.ForeColor = System.Drawing.Color.White;
                btn.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Bold);
                winningsShuffled[boxNo] = 0;
                boxesChosen++;
                boxesRemaining--;


                
                if (moneyValue == .01)      //blacks out the contents of winnings panel as corresponding boxes are chosen
                {
                    lblArrayL[0].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == .10)
                {
                    lblArrayL[1].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == .50)
                {
                    lblArrayL[2].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 1)
                {
                    lblArrayL[3].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 10)
                {
                    lblArrayL[4].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 25)
                {
                    lblArrayL[5].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 50)
                {
                    lblArrayL[6].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 75)
                {
                    lblArrayL[7].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 100)
                {
                    lblArrayL[8].ForeColor = System.Drawing.Color.Black;
                }


                if (moneyValue == 1000)
                {
                    lblArrayR[0].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 10000)
                {
                    lblArrayR[1].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 25000)
                {
                    lblArrayR[2].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 50000)
                {
                    lblArrayR[3].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 75000)
                {
                    lblArrayR[4].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 100000)
                {
                    lblArrayR[5].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 150000)
                {
                    lblArrayR[6].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 200000)
                {
                    lblArrayR[7].ForeColor = System.Drawing.Color.Black;
                }
                if (moneyValue == 250000)
                {
                    lblArrayR[8].ForeColor = System.Drawing.Color.Black;
                }
            }


            if (boxesChosen == 3)       //displays an offer every 3 boxes
            {
                offerGen();
                DialogResult dialogResult = MessageBox.Show("Would you like to accept?", "Your offer is " + offer.ToString("C"), MessageBoxButtons.YesNo);

                if (dialogResult == DialogResult.Yes)       //displays winnings and exits game
                {
                    MessageBox.Show("Congratulations! You have won " + offer.ToString("C"));
                    Application.Exit();
                }
                else if (dialogResult == DialogResult.No)       //closes message box and keeps playing
                {
                    boxesChosen = 0;        //resets boxes chosen for another round
                    lblOffer.Text = offer.ToString("C");
                }
            }
            else if (boxesRemaining <= 2)       //makes the playes choose between last two boxes
            {   double moneyLeft = 0;
                for (int i = 0; i < winningsShuffled.Length; i++)
                {
                    moneyLeft += winningsShuffled[i];
                }
                moneyLeft -= firstBoxMoney;
                DialogResult dialogResult = MessageBox.Show("Press yes to keep your own or no to swap for the last remaining box", "Two boxes remain", MessageBoxButtons.YesNo);

                if (dialogResult == DialogResult.Yes)       //displays the players chosen box contents and exits the game
                {
                    MessageBox.Show("Congratulations! You have won " + firstBoxMoney.ToString("C"));
                    MessageBox.Show("The other box contained " + moneyLeft.ToString("C"));
                    Application.Exit();
                }
                else if (dialogResult == DialogResult.No)       //displays the last remaining box contents and exits the game
                {
                    MessageBox.Show("Congratulations! You have won " + moneyLeft.ToString("C"));
                    MessageBox.Show("Your box contained " + firstBoxMoney.ToString("C"));
                    Application.Exit();
                }
            }
        }

        public void offerGen()      //generates an offer every three boxes chosen
        {
            double cash = 0;
            for (int i = 0; i < winningsShuffled.Length; i++)
                cash += winningsShuffled[i];
            offer = cash / boxesRemaining;

            if (boxesRemaining >=8 && offer >= 30000)      //sets low offers early game
            {
                offer = offer / 20;
            }
            else
            {
                offer = cash / boxesRemaining;
            }
        }

    }
}
    