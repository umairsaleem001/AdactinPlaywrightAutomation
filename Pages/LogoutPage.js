class LogoutPage 
{
    constructor(page) 
    {
        this.page = page;
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.loginAgainLink = page.getByRole('link', { name: 'Click here to login again' });
    }

    async gotoLogoutPage() 
    {
         await this.logoutLink.click();
    }
}

export default LogoutPage;