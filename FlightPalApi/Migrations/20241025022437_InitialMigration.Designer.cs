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
    [Migration("20241025022437_InitialMigration")]
    partial class InitialMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("FlightPalApi.Models.Aircraft", b =>
                {
                    b.Property<long>("AircraftId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<string>("Manufacturer")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Model")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("AircraftId");

                    b.ToTable("Aircraft");
                });

            modelBuilder.Entity("FlightPalApi.Models.CrewMember", b =>
                {
                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.ToTable("CrewMember");
                });

            modelBuilder.Entity("FlightPalApi.Models.Flight", b =>
                {
                    b.Property<long>("FlightId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<long>("AircraftId")
                        .HasColumnType("bigint");

                    b.Property<string>("CrewMembersJson")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<float>("Duration")
                        .HasColumnType("float");

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
                    b.Property<long>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("FName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("LName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("FlightPalApi.Models.UserAircraft", b =>
                {
                    b.Property<long>("UserId")
                        .HasColumnType("bigint");

                    b.Property<long>("AircraftId")
                        .HasColumnType("bigint");

                    b.Property<float>("CurrentHours")
                        .HasColumnType("float");

                    b.Property<float>("RequiredHours")
                        .HasColumnType("float");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("UserId", "AircraftId");

                    b.HasIndex("AircraftId");

                    b.ToTable("UserAircraft");
                });

            modelBuilder.Entity("FlightPalApi.Models.Flight", b =>
                {
                    b.HasOne("FlightPalApi.Models.User", null)
                        .WithMany("Flights")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("FlightPalApi.Models.UserAircraft", b =>
                {
                    b.HasOne("FlightPalApi.Models.Aircraft", "Aircraft")
                        .WithMany()
                        .HasForeignKey("AircraftId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FlightPalApi.Models.User", "User")
                        .WithMany("UserAircrafts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Aircraft");

                    b.Navigation("User");
                });

            modelBuilder.Entity("FlightPalApi.Models.User", b =>
                {
                    b.Navigation("Flights");

                    b.Navigation("UserAircrafts");
                });
#pragma warning restore 612, 618
        }
    }
}
