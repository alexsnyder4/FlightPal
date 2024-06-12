using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlightPalApi.Migrations
{
    public partial class ChangedFlightIdToFlightId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Flight",
                newName: "FlightId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FlightId",
                table: "Flight",
                newName: "Id");
        }
    }
}
