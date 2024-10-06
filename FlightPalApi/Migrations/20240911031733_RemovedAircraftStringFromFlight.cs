using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlightPalApi.Migrations
{
    public partial class RemovedAircraftStringFromFlight : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Aircraft",
                table: "Flight");

            migrationBuilder.AlterColumn<float>(
                name: "RequiredHours",
                table: "UserAircraft",
                type: "float",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<float>(
                name: "CurrentHours",
                table: "UserAircraft",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AlterColumn<float>(
                name: "Duration",
                table: "Flight",
                type: "float",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)");

            migrationBuilder.AddColumn<long>(
                name: "AircraftId",
                table: "Flight",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentHours",
                table: "UserAircraft");

            migrationBuilder.DropColumn(
                name: "AircraftId",
                table: "Flight");

            migrationBuilder.AlterColumn<int>(
                name: "RequiredHours",
                table: "UserAircraft",
                type: "int",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "float");

            migrationBuilder.AlterColumn<decimal>(
                name: "Duration",
                table: "Flight",
                type: "decimal(65,30)",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "float");

            migrationBuilder.AddColumn<string>(
                name: "Aircraft",
                table: "Flight",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
