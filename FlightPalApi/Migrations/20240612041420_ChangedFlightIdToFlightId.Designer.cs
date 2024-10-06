﻿// <auto-generated />
using System;
using FlightPalApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace FlightPalApi.Migrations
{
    [DbContext(typeof(FlightPalContext))]
    [Migration("20240612041420_ChangedFlightIdToFlightId")]
    partial class ChangedFlightIdToFlightId
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("FlightPalApi.Models.Flight", b =>
                {
                    b.Property<long>("FlightId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<string>("Aircraft")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<decimal>("Duration")
                        .HasColumnType("decimal(65,30)");

                    b.Property<string>("StartLocation")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("StopLocation")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<long>("UserId")
                        .HasColumnType("bigint");

                    b.HasKey("FlightId");

                    b.HasIndex("UserId");

                    b.ToTable("Flight");
                });

            modelBuilder.Entity("FlightPalApi.Models.User", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<string>("fName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("lName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("password")
                        .HasColumnType("longtext");

                    b.HasKey("id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("FlightPalApi.Models.Flight", b =>
                {
                    b.HasOne("FlightPalApi.Models.User", "User")
                        .WithMany("Flights")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("FlightPalApi.Models.User", b =>
                {
                    b.Navigation("Flights");
                });
#pragma warning restore 612, 618
        }
    }
}
