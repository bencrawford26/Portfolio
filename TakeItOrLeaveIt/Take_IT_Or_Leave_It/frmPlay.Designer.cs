namespace Take_IT_Or_Leave_It
{
    partial class frmPlay
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.btnExit = new System.Windows.Forms.Button();
            this.label19 = new System.Windows.Forms.Label();
            this.lblYourBox = new System.Windows.Forms.Label();
            this.lblOffer = new System.Windows.Forms.Label();
            this.boxPanel = new System.Windows.Forms.Panel();
            this.winningsL = new System.Windows.Forms.Panel();
            this.winningsR = new System.Windows.Forms.Panel();
            this.lblHolder = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // btnExit
            // 
            this.btnExit.BackColor = System.Drawing.Color.Crimson;
            this.btnExit.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnExit.ForeColor = System.Drawing.SystemColors.ButtonHighlight;
            this.btnExit.Location = new System.Drawing.Point(975, 534);
            this.btnExit.Name = "btnExit";
            this.btnExit.Size = new System.Drawing.Size(80, 80);
            this.btnExit.TabIndex = 20;
            this.btnExit.Text = "Exit";
            this.btnExit.UseVisualStyleBackColor = false;
            this.btnExit.Click += new System.EventHandler(this.btnExit_Click);
            // 
            // label19
            // 
            this.label19.BackColor = System.Drawing.Color.MediumBlue;
            this.label19.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.label19.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label19.ForeColor = System.Drawing.SystemColors.ButtonHighlight;
            this.label19.Location = new System.Drawing.Point(12, 529);
            this.label19.Name = "label19";
            this.label19.Size = new System.Drawing.Size(100, 83);
            this.label19.TabIndex = 22;
            this.label19.Text = "Previous Offer";
            this.label19.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // lblYourBox
            // 
            this.lblYourBox.BackColor = System.Drawing.Color.Crimson;
            this.lblYourBox.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.lblYourBox.Font = new System.Drawing.Font("Microsoft Sans Serif", 16F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblYourBox.ForeColor = System.Drawing.SystemColors.ButtonHighlight;
            this.lblYourBox.Location = new System.Drawing.Point(501, 529);
            this.lblYourBox.Name = "lblYourBox";
            this.lblYourBox.Size = new System.Drawing.Size(80, 80);
            this.lblYourBox.TabIndex = 23;
            this.lblYourBox.Text = "Your Box";
            this.lblYourBox.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lblOffer
            // 
            this.lblOffer.BackColor = System.Drawing.SystemColors.ButtonHighlight;
            this.lblOffer.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.lblOffer.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblOffer.Location = new System.Drawing.Point(13, 572);
            this.lblOffer.Name = "lblOffer";
            this.lblOffer.Size = new System.Drawing.Size(99, 40);
            this.lblOffer.TabIndex = 24;
            this.lblOffer.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // boxPanel
            // 
            this.boxPanel.Location = new System.Drawing.Point(12, 90);
            this.boxPanel.Name = "boxPanel";
            this.boxPanel.Size = new System.Drawing.Size(1043, 401);
            this.boxPanel.TabIndex = 25;
            // 
            // winningsL
            // 
            this.winningsL.Location = new System.Drawing.Point(332, 12);
            this.winningsL.Name = "winningsL";
            this.winningsL.Size = new System.Drawing.Size(155, 281);
            this.winningsL.TabIndex = 26;
            // 
            // winningsR
            // 
            this.winningsR.Location = new System.Drawing.Point(572, 12);
            this.winningsR.Name = "winningsR";
            this.winningsR.Size = new System.Drawing.Size(155, 281);
            this.winningsR.TabIndex = 27;
            // 
            // lblHolder
            // 
            this.lblHolder.AutoSize = true;
            this.lblHolder.Location = new System.Drawing.Point(400, 447);
            this.lblHolder.Name = "lblHolder";
            this.lblHolder.Size = new System.Drawing.Size(0, 13);
            this.lblHolder.TabIndex = 28;
            this.lblHolder.Visible = false;
            // 
            // frmPlay
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.SystemColors.ButtonHighlight;
            this.ClientSize = new System.Drawing.Size(1067, 621);
            this.Controls.Add(this.lblHolder);
            this.Controls.Add(this.winningsR);
            this.Controls.Add(this.winningsL);
            this.Controls.Add(this.boxPanel);
            this.Controls.Add(this.lblOffer);
            this.Controls.Add(this.lblYourBox);
            this.Controls.Add(this.label19);
            this.Controls.Add(this.btnExit);
            this.Name = "frmPlay";
            this.Text = "Choose your box to begin playing";
            this.Load += new System.EventHandler(this.frmPlay_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.Button btnExit;
        private System.Windows.Forms.Label label19;
        private System.Windows.Forms.Label lblYourBox;
        private System.Windows.Forms.Label lblOffer;
        private System.Windows.Forms.Panel boxPanel;
        private System.Windows.Forms.Panel winningsL;
        private System.Windows.Forms.Panel winningsR;
        private System.Windows.Forms.Label lblHolder;
    }
}