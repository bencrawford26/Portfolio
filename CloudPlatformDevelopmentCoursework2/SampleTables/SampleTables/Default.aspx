<%@ Page Language="C#" AutoEventWireup="true" Debug="true" CodeBehind="Default.aspx.cs" Inherits="Mp3Previews._Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Mp3 Gallery</title>
</head>
<body>
    <form id="form1" runat="server">
        <asp:ScriptManager ID="sm1" runat="server" />
        <div>
            Upload mp3:
            <asp:FileUpload ID="upload" runat="server" />
            <asp:Button ID="submitButton" runat="server" Text="Submit" OnClick="submitButton_Click" />
        </div>
        <div>
            <asp:UpdatePanel ID="up1" runat="server">
                <ContentTemplate>
                    <asp:ListView ID="PreviewDisplayControl" runat="server">
                        <LayoutTemplate>
                            <asp:Image ID="itemPlaceholder" runat="server" />
                        </LayoutTemplate>
                        <ItemTemplate>
                            <table>
                                <tr>
                                    <td>
                                        <audio src='<%# Eval("Url") %>' controls="" preload="none"></audio>
                                        <asp:Literal id="name" runat="server" Text='<%# Eval("Title") %>' />
                                    </td>
                                </tr>
                            </table>
                        </ItemTemplate>
                    </asp:ListView>
                </ContentTemplate>
            </asp:UpdatePanel>
            <asp:Button id="refreshButton" runat="server" Text="Refresh" OnClick="refreshButton_Click" />
        </div>
    </form>
</body>
</html>
