package com.demo.project.enums;

public enum InstituteType {
    COLLEGE("COLLEGE"),
    STANDALONE("STANDALONE"),
    UNIVERSITY("UNIVERSITY")
    ;

    private final String text;

    /**
     * @param text
     */
    InstituteType(final String text) {
        this.text = text;
    }

    /* (non-Javadoc)
     * @see java.lang.Enum#toString()
     */
    @Override
    public String toString() {
        return text;
    }
}