package com.journeyjoy.utilities;

public class StringUtil {
    public static String toTitleCase(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        String[] words = input.split("\\s+");
        StringBuilder titleCase = new StringBuilder();
        for (String word : words) {
            if (word.length() > 1) {
                titleCase.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1).toLowerCase());
            } else {
                titleCase.append(word.toUpperCase());
            }
            titleCase.append(" ");
        }
        return titleCase.toString().trim();
    }
}