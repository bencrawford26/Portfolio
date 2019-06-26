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
    public partial class frmRules : Form
    {
        public frmRules()
        {
            InitializeComponent();
        }

        private void btnStart_Click(object sender, EventArgs e)
        {
            //display the numbers form
            frmPlay frm = new frmPlay();
            frm.Show();
        }

    }
}
