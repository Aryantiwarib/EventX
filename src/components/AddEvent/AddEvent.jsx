import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCalendarAlt, FaTag, FaMapMarkerAlt, FaImage, FaEdit } from "react-icons/fa";
import { GiPriceTag } from "react-icons/gi";

export default function EventForm({ event }) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: event?.title || "",
            slug: event?.$id || "",
            status: event?.status || "active",
            price: event?.price || "",
            CollegeYear: event?.CollegeYear?.split(', ') || [],
            category: event?.category || "",
            date: event?.date || "",
            venue: event?.venue || "",
            description: event?.description || "",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        try {
            let templateId = event?.template || null;
            const isNewEvent = !event;

            // Handle file upload
            if (data.image[0]) {
                const file = await appwriteService.uploadFile(data.image[0]);
                templateId = file.$id;
            }

            // Validate template for new events
            if (isNewEvent && !templateId) {
                throw new Error("Template image is required");
            }

            const eventData = {
                ...data,
                CollegeYear: data.CollegeYear,
                template: templateId,
                userId: userData.$id,
            };

            if (event) {
                await appwriteService.updateEvent(event.$id, eventData);
                navigate(`/events/${event.$id}`);
            } else {
                const newEvent = await appwriteService.createEvent(eventData);
                navigate(`/events/${newEvent.$id}`);
            }
        } catch (error) {
            console.error("Event submission failed:", error);
            alert(error.message);
        }
    };

    const slugTransform = useCallback((value) => {
        return value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s/g, "-");
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    // College Year Options
    const collegeYears = [
        { value: "I", label: "First Year (I)" },
        { value: "II", label: "Second Year (II)" },
        { value: "III", label: "Third Year (III)" },
        { value: "IV", label: "Fourth Year (IV)" },
    ];

    // Event Category Options
    const eventCategories = [
        "Music",
        "Tech",
        "Sports",
        "Cultural",
        "Academic",
        "Workshop",
        "Seminar",
        "Other"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit(submit)} className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 space-y-8">
                {/* Form Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {event ? "Edit Event" : "Create New Event"}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {event ? "Update your event details" : "Craft an unforgettable experience"}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Title Input */}
                        <div className="relative">
                            <Input
                                label="Event Title"
                                placeholder="Tech Conference 2024"
                                className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                {...register("title", { required: "Title is required" })}
                                error={errors.title?.message}
                            />
                            <FaEdit className="absolute left-4 top-[42px] text-gray-400" />
                        </div>

                        {/* Slug Input */}
                        <div className="relative">
                            <Input
                                label="Event Slug"
                                placeholder="tech-conference-2024"
                                className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                {...register("slug", { required: "Slug is required" })}
                                error={errors.slug?.message}
                                onInput={(e) => {
                                    setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                                }}
                            />
                            <FaTag className="absolute left-4 top-[42px] text-gray-400" />
                        </div>

                        {/* Price and Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <Input
                                    label="Price"
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    {...register("price", { required: "Price is required" })}
                                    error={errors.price?.message}
                                />
                                <GiPriceTag className="absolute left-4 top-[42px] text-gray-400" />
                            </div>

                            <div className="relative">
                                <Input
                                    label="Event Date"
                                    type="date"
                                    className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    {...register("date", { required: "Date is required" })}
                                    error={errors.date?.message}
                                />
                                <FaCalendarAlt className="absolute left-4 top-[42px] text-gray-400" />
                            </div>
                        </div>

                        {/* Target Year Selection */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Academic Year
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {collegeYears.map((year) => (
                                    <label
                                        key={year.value}
                                        className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            value={year.value}
                                            {...register("CollegeYear", { required: "At least one year must be selected" })}
                                            className="form-checkbox h-5 w-5 text-blue-600 rounded-lg focus:ring-blue-500"
                                        />
                                        <span className="ml-3 text-gray-700">{year.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.CollegeYear && (
                                <p className="text-red-500 text-sm mt-1">{errors.CollegeYear.message}</p>
                            )}
                        </div>

                        {/* Category Selection */}
                        <div className="relative">
                            <Select
                                label="Event Category"
                                options={eventCategories}
                                className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                {...register("category", { required: "Category is required" })}
                                error={errors.category?.message}
                            />
                            <FaTag className="absolute left-4 top-[42px] text-gray-400" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Venue Input */}
                        <div className="relative">
                            <Input
                                label="Event Venue"
                                placeholder="Convention Center, New Delhi"
                                className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                {...register("venue", { required: "Venue is required" })}
                                error={errors.venue?.message}
                            />
                            <FaMapMarkerAlt className="absolute left-4 top-[42px] text-gray-400" />
                        </div>

                        {/* Image Upload */}
                        <div className="group relative">
                            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors
                                ${errors.image ? "border-red-500" : "border-gray-200 hover:border-blue-400"}`}>
                                <label className="cursor-pointer block">
                                    <FaImage className="mx-auto text-3xl text-gray-400 mb-3 transition-colors group-hover:text-blue-500" />
                                    <span className="block text-sm font-medium text-gray-600">
                                        {event ? "Update Template Image" : "Upload Template Image"}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/png, image/jpg, image/jpeg"
                                        {...register("image", {
                                            required: !event && "Template image is required",
                                            validate: {
                                                validFile: files => 
                                                    !files[0] || 
                                                    files[0].type.startsWith('image/') || 
                                                    "Only image files allowed"
                                            }
                                        })}
                                    />
                                    <div className="mt-4">
                                        {event?.template ? (
                                            <img
                                                src={appwriteService.getFilePreview(event.template)}
                                                alt={event.title}
                                                className="w-full h-32 object-cover rounded-lg shadow-sm"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                {watch("image")?.[0]?.name || "No file chosen"}
                                            </p>
                                        )}
                                    </div>
                                </label>
                            </div>
                            {errors.image && (
                                <p className="text-red-500 text-sm mt-2 px-2">
                                    {errors.image.message}
                                </p>
                            )}
                        </div>

                        {/* Status Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Event Status
                            </label>
                            <Select
                                options={["active", "inactive"]}
                                className="py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                {...register("status", { required: "Status is required" })}
                                error={errors.status?.message}
                            />
                        </div>

                        {/* Description Editor */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Event Description
                            </label>
                            <RTE
                                name="description"
                                control={control}
                                defaultValue={getValues("description")}
                                className={`border-2 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 min-h-[200px]
                                    ${errors.description ? "border-red-500" : "border-gray-200"}`}
                                rules={{ required: "Description is required" }}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={Object.keys(errors).length > 0}
                        >
                            {event ? "Update Event" : "Create Event →"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}