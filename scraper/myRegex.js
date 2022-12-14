module.exports = 
    regexPatterns = {
        "angellist": {
        "company": {
            "regex": "(?:https?:)?\\/\\/angel\\.co\\/company\\/(?P<company>[A-z0-9_-]+)(?:\\/(?P<company_subpage>[A-z0-9-]+))?",
            "tests": {
            "https://angel.co/company/twitter": {
                "company": "twitter"
            },
            "https://angel.co/company/twitter/culture": {
                "company": "twitter",
                "company_subpage": "culture"
            }
            }
        },
        "job": {
            "regex": "(?:https?:)?\\/\\/angel\\.co\\/company\\/(?P<company>[A-z0-9_-]+)\\/jobs\\/(?P<job_permalink>(?P<job_id>[0-9]+)-(?P<job_slug>[A-z0-9-]+))",
            "tests": {
            "https://angel.co/company/twitter/jobs/576275-engineering-manager": {
                "company": "twitter",
                "job_id": "576275",
                "job_permalink": "576275-engineering-manager",
                "job_slug": "engineering-manager"
            }
            }
        },
        "user": {
            "note": "There are root-level direct links to users, e.g. angel.co/karllorey, that get redirected to these new user links now. Sometimes it's /p/, sometimes it's /u/, haven't figured out why that is...",
            "regex": "(?:https?:)?\\/\\/angel\\.co\\/(?P<type>u|p)\\/(?P<user>[A-z0-9_-]+)",
            "tests": {
            "https://angel.co/p/naval": {
                "type": "p",
                "user": "naval"
            },
            "https://angel.co/u/karllorey": {
                "type": "u",
                "user": "karllorey"
            }
            }
        }
        },
        "crunchbase": {
        "company": {
            "regex": "(?:https?:)?\\/\\/crunchbase\\.com\\/organization\\/(?P<organization>[A-z0-9_-]+)",
            "tests": {
            "http://crunchbase.com/organization/acme-corp": {
                "organization": "acme-corp"
            }
            }
        },
        "person": {
            "regex": "(?:https?:)?\\/\\/crunchbase\\.com\\/person\\/(?P<person>[A-z0-9_-]+)",
            "tests": {
            "http://crunchbase.com/person/karl-lorey": {
                "person": "karl-lorey"
            }
            }
        }
        },
        "email": {
        "mailto": {
            "note": "This matches plain emails and mailto hyperlinks. This regex is intended for scraping and not as a validation. See why: [\"Your email validation logic is wrong\"](https://www.netmeister.org/blog/email.html).",
            "regex": "(?:mailto:)?(?P<email>[A-z0-9_.+-]+@[A-z0-9_.-]+\\.[A-z]+)",
            "tests": {
            "jeff@amazon.com": {
                "email": "jeff@amazon.com"
            },
            "mailto:jeff@amazon.com": {
                "email": "jeff@amazon.com"
            },
            "mailto:plususer+test@gmail.com": {
                "email": "plususer+test@gmail.com"
            }
            }
        }
        },
        "facebook": {
            "profile": {
                "note": "A profile can be a page, a user profile, or something else. Since Facebook redirects these URLs to all kinds of objects (user, pages, events, and so on), you have to verify that it's actually a user. See https://developers.facebook.com/docs/graph-api/reference/profile",
                "regex": "(?:https?:)?\\/\\/(?:www\\.)?(?:facebook|fb)\\.com\\/(?P<profile>(?![A-z]+\\.php)(?!marketplace|gaming|watch|me|messages|help|search|groups)[A-z0-9_\\-\\.]+)\\/?",
                "tests": {
                    "http://fb.com/peter_parker-miller": {
                        "profile": "peter_parker-miller"
                    },
                    "https://facebook.com/gaming": null,
                    "https://facebook.com/groups": null,
                    "https://facebook.com/help": null,
                    "https://facebook.com/home.php": null,
                    "https://facebook.com/marketplace": null,
                    "https://facebook.com/me": null,
                    "https://facebook.com/messages": null,
                    "https://facebook.com/peter.parker": {
                        "profile": "peter.parker"
                    },
                    "https://facebook.com/peterparker": {
                        "profile": "peterparker"
                    },
                    "https://facebook.com/search": null,
                    "https://facebook.com/watch": null
                }
            },
            "profile by id": {
                "regex": "(?:https?:)?\\/\\/(?:www\\.)facebook.com/(?:profile.php\\?id=)?(?P<id>[0-9]+)",
                    "tests": {
                        "https://www.facebook.com/100004123456789": {
                            "id": "100004123456789"
                        },
                        "https://www.facebook.com/profile.php?id=100004123456789": {
                            "id": "100004123456789"
                        }
                    }
            }
        },
        "github": {
        "repo": {
            "note": "Exclude subdomains as these redirect to github pages sometimes.",
            "regex": "(?:https?:)?\\/\\/(?:www\\.)?github\\.com\\/(?P<login>[A-z0-9_-]+)\\/(?P<repo>[A-z0-9_-]+)\\/?",
            "tests": {
            "https://github.com/lorey/": null,
            "https://github.com/lorey/socials": {
                "login": "lorey",
                "repo": "socials"
            }
            }
        },
        "user": {
            "note": "Exclude subdomains other than `www.` as these redirect to github pages sometimes.",
            "regex": "(?:https?:)?\\/\\/(?:www\\.)?github\\.com\\/(?P<login>[A-z0-9_-]+)\\/?",
            "tests": {
            "https://github.com/lorey/": {
                "login": "lorey"
            },
            "https://github.com/lorey/socials": null
            }
        }
        },
        "google plus": {
        "user id": {
            "note": "Matches profile numbers with exactly 21 digits.",
            "regex": "(?:https?:)?\\/\\/plus\\.google\\.com\\/(?P<id>[0-9]{21})",
            "tests": {
            "https://plus.google.com/111111111111111111111": {
                "id": "111111111111111111111"
            }
            }
        },
        "username": {
            "note": "Matches username.",
            "regex": "(?:https?:)?\\/\\/plus\\.google\\.com\\/\\+(?P<username>[A-z0-9+]+)",
            "tests": {
            "https://plus.google.com/+googleplususername": {
                "username": "googleplususername"
            }
            }
        }
        },
        "hackernews": {
        "item": {
            "note": "An item can be a post or a direct link to a comment.",
            "regex": "(?:https?:)?\\/\\/news\\.ycombinator\\.com\\/item\\?id=(?P<item>[0-9]+)",
            "tests": {
            "https://news.ycombinator.com/item?id=23290375": {
                "item": "23290375"
            }
            }
        },
        "user": {
            "regex": "(?:https?:)?\\/\\/news\\.ycombinator\\.com\\/user\\?id=(?P<user>[A-z0-9_-]+)",
            "tests": {
            "https://news.ycombinator.com/user?id=CamelCaps": {
                "user": "CamelCaps"
            },
            "https://news.ycombinator.com/user?id=dash-and-underscore_are-valid": {
                "user": "dash-and-underscore_are-valid"
            },
            "https://news.ycombinator.com/user?id=lorey": {
                "user": "lorey"
            }
            }
        }
        },
        "instagram": {
        "profile": {
            "note": "The rules:\n\n* Matches with one . in them disco.dude but not two .. disco..dude\n* Ending period not matched discodude.\n* Match underscores _disco__dude\n* Max characters of 30 1234567890123456789012345678901234567890",
            "regex": "(?:https?:)?\\/\\/(?:www\\.)?(?:instagram\\.com|instagr\\.am)\\/(?P<username>[A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\\.(?!\\.))){0,28}(?:[A-Za-z0-9_]))?)",
            "tests": {
            "https://instagram.com/__disco__dude": {
                "username": "__disco__dude"
            },
            "https://instagram.com/disco..dude": null,
            "https://instagram.com/disco.dude": {
                "username": "disco.dude"
            },
            "https://www.instagr.am/__disco__dude": {
                "username": "__disco__dude"
            }
            }
        }
        },
        "linkedin": {
            "company": {
                "note": `This matches companies and schools. Permalink is an integer id or a slug. The id permalinks redirect to the slug 
                        permalinks as soon as one is set. Permalinks can contain special characters. Recently, company links that are 
                        actually schools get redirected to newly introduced /school/ permalinks, see the university example below."`,
                "regex": "(?:https?:)?\\/\\/(?:[\\w]+\\.)?linkedin\\.com\\/(?P<company_type>(company)|(school))\\/(?P<company_permalink>[A-z0-9-\u00c0-\u00ff\\.]+)\\/?",
                "tests": {
                "https://fr.linkedin.com/school/universit\u00e9-grenoble-alpes/": {
                    "company_permalink": "universit\u00e9-grenoble-alpes",
                    "company_type": "school"
                },
                "https://linkedin.com/company/dash-company.io": {
                    "company_permalink": "dash-company.io",
                    "company_type": "company"
                },
                "https://www.linkedin.com/company/1234567/": {
                    "company_permalink": "1234567",
                    "company_type": "company"
                }
                }
            },
            "post": {
                "note": "Direct link to a Linkedin post, only contains a post id.",
                "regex": "(?:https?:)?\\/\\/(?:[\\w]+\\.)?linkedin\\.com\\/feed\\/update\\/urn:li:activity:(?P<activity_id>[0-9]+)\\/?",
                "tests": {
                "https://www.linkedin.com/feed/update/urn:li:activity:6665508550111912345/": {
                    "activity_id": "6665508550111912345"
                }
                }
            },
            "profile": {
                "note": "These are the currently used, most-common urls ending in /in/<permalink>",
                //"regex": "(?:https?:)?\\/\\/(?:[\\w]+\\.)?linkedin\\.com\\/in\\/(?P<permalink>[\\w\\-\\_\u00c0-\u00ff%]+)\\/?",
                "regex": "(?:https?:)?\\/\\/(?:[\\w]+\\.)?linkedin\\.com\\/in\\/[\\w\\-\\_??-??%]+\\/?",
                "tests": {
                "https://de.linkedin.com/in/peter-m\u00fcller-81a8/": {
                    "permalink": "peter-m\u00fcller-81a8"
                },
                "https://linkedin.com/in/karllorey": {
                    "permalink": "karllorey"
                }
                }
            },
            "profile_pub": {
                "note": "These are old public urls not used anymore, more info at [quora](https://www.quora.com/What-is-the-difference-between-www-linkedin-com-pub-and-www-linkedin-com-in)",
                "regex": "(?:https?:)?\\/\\/(?:[\\w]+\\.)?linkedin\\.com\\/pub\\/(?P<permalink_pub>[A-z0-9_-]+)(?:\\/[A-z0-9]+){3}\\/?",
                "tests": {
                "https://linkedin.com/pub/karllorey/abc/123/be": {
                    "permalink_pub": "karllorey"
                },
                "https://www.linkedin.com/pub/karllorey/abc/123/be": {
                    "permalink_pub": "karllorey"
                }
                }
            }
        },
        "medium": {
            "post": {
                "regex": "(?:https?:)?\\/\\/medium\\.com\\/(?:(?:@(?P<username>[A-z0-9]+))|(?P<publication>[a-z-]+))\\/(?P<slug>[a-z0-9\\-]+)-(?P<post_id>[A-z0-9]+)(?:\\?.*)?",
                "tests": {
                "https://medium.com/@karllorey/keeping-pandas-dataframes-clean-when-importing-json-348d3439ed67": {
                    "post_id": "348d3439ed67",
                    "slug": "keeping-pandas-dataframes-clean-when-importing-json",
                    "username": "karllorey"
                },
                "https://medium.com/does-exist/some-post-123abc": {
                    "post_id": "123abc",
                    "publication": "does-exist",
                    "slug": "some-post"
                }
                }
            },
            "post of subdomain publication": {
                "note": "Can't match these with the regular post regex as redefinitions of subgroups are not allowed in pythons regex.",
                "regex": "(?:https?:)?\\/\\/(?P<publication>(?!www)[a-z-]+)\\.medium\\.com\\/(?P<slug>[a-z0-9\\-]+)-(?P<post_id>[A-z0-9]+)(?:\\?.*)?",
                "tests": {
                "https://onezero.medium.com/what-facebooks-remote-work-policy-means-for-the-future-of-tech-salaries-everywhere-edf859226b62?source=grid_home------": {
                    "post_id": "edf859226b62",
                    "publication": "onezero",
                    "slug": "what-facebooks-remote-work-policy-means-for-the-future-of-tech-salaries-everywhere"
                },
                "https://www.medium.com/foo": null
                }
            },
            "user": {
                "regex": "(?:https?:)?\\/\\/medium\\.com\\/@(?P<username>[A-z0-9]+)(?:\\?.*)?",
                "tests": {
                "https://medium.com/@karllorey": {
                    "username": "karllorey"
                }
                }
            },
            "user by id": {
                "note": "Now redirects to new user profiles. Follow with a head or get request.",
                "regex": "(?:https?:)?\\/\\/medium\\.com\\/u\\/(?P<user_id>[A-z0-9]+)(?:\\?.*)",
                "tests": {
                "https://medium.com/u/b3d3d3653c2c?source=post_page-----da92b81b85ef----------------------": {
                    "user_id": "b3d3d3653c2c"
                }
                }
            }
        },
        "phone": {
            "phone number": {
                "note": "Should be cleaned afterwards to strip dots, spaces, etc.",
                "regex": "(?:tel|phone|mobile):(?P<number>\\+?[0-9. -]+)",
                "tests": {
                "tel:+49 900 123456": {
                    "number": "+49 900 123456"
                },
                "tel:+49 9OO 123456": null,
                "tel:+49900123456": {
                    "number": "+49900123456"
                }
                }
            }
        },
        "reddit": {
        "user": {
            "regex": "(?:https?:)?\\/\\/(?:[a-z]+\\.)?reddit\\.com\\/(?:u(?:ser)?)\\/(?P<username>[A-z0-9\\-\\_]*)\\/?",
            "tests": {
            "https://old.reddit.com/user/ar-guetita": {
                "username": "ar-guetita"
            },
            "https://reddit.com/r/de": null,
            "https://reddit.com/u/ar-guetita": {
                "username": "ar-guetita"
            }
            }
        }
        },
        "skype": {
        "profile": {
            "note": "Matches Skype's URLs to add contact, call, chat. More info at [Skype SDK's docs](https://docs.microsoft.com/en-us/skype-sdk/skypeuris/skypeuris).",
            "regex": "(?:(?:callto|skype):)(?P<username>[a-z][a-z0-9\\.,\\-_]{5,31})(?:\\?(?:add|call|chat|sendfile|userinfo))?",
            "tests": {
            "skype:echo123": {
                "username": "echo123"
            },
            "skype:echo123?call": {
                "username": "echo123"
            }
            }
        }
        },
        "snapchat": {
        "profile": {
            "regex": "(?:https?:)?\\/\\/(?:www\\.)?snapchat\\.com\\/add\\/(?P<username>[A-z0-9\\.\\_\\-]+)\\/?",
            "tests": {
            "https://www.snapchat.com/add/peterparker": {
                "username": "peterparker"
            }
            }
        }
        },
        "stackexchange": {
        "user": {
            "note": "This is the meta-platform above stackoverflow, etc. Username can be changed at any time, user_id is persistent.",
            "regex": "(?:https?:)?\\/\\/(?:www\\.)?stackexchange\\.com\\/users\\/(?P<id>[0-9]+)\\/(?P<username>[A-z0-9-_.]+)\\/?",
            "tests": {
            "https://stackexchange.com/users/12345/lorey": {
                "id": "12345",
                "username": "lorey"
            }
            }
        }
        },
        "stackexchange network": {
        "user": {
            "note": "While there are some \"named\" communities in the stackexchange network like stackoverflow, many only exist as subdomains, i.e. gaming.stackexchange.com. Again, username can be changed at any time, user_id is persistent.",
            "regex": "(?:https?:)?\\/\\/(?:(?P<community>[a-z]+(?!www))\\.)?stackexchange\\.com\\/users\\/(?P<id>[0-9]+)\\/(?P<username>[A-z0-9-_.]+)\\/?",
            "tests": {
            "https://gaming.stackexchange.com/users/12345/lorey": {
                "community": "gaming",
                "id": "12345",
                "username": "lorey"
            },
            "https://www.stackexchange.com/user/12345/lorey": null
            }
        }
        },
        "stackoverflow": {
        "question": {
            "regex": "(?:https?:)?\\/\\/(?:www\\.)?stackoverflow\\.com\\/questions\\/(?P<id>[0-9]+)\\/(?P<title>[A-z0-9-_.]+)\\/?",
            "tests": {
            "https://stackoverflow.com/questions/12345/how-to-embed": {
                "id": "12345",
                "title": "how-to-embed"
            }
            }
        },
        "user": {
            "note": "Username can be changed at any time, user_id is persistent.",
            "regex": "(?:https?:)?\\/\\/(?:www\\.)?stackoverflow\\.com\\/users\\/(?P<id>[0-9]+)\\/(?P<username>[A-z0-9-_.]+)\\/?",
            "tests": {
            "https://ru.stackoverflow.com/users/12345/lorey": null,
            "https://stackoverflow.com/users/12345/lorey": {
                "id": "12345",
                "username": "lorey"
            }
            }
        }
        },
        "telegram": {
        "profile": {
            "note": "Matches for t.me, telegram.me and telegram.org.",
            "regex": "(?:https?:)?\\/\\/(?:t(?:elegram)?\\.me|telegram\\.org)\\/(?P<username>[a-z0-9\\_]{5,32})\\/?",
            "tests": {
            "https://t.me/peterparker": {
                "username": "peterparker"
            }
            }
        }
        },
        "twitter": {
            "status": {
                "regex": "(?:https?:)?\\/\\/(?:[A-z]+\\.)?twitter\\.com\\/@?(?P<username>[A-z0-9_]+)\\/status\\/(?P<tweet_id>[0-9]+)\\/?",
                "tests": {
                "https://twitter.com/karllorey/status/1259924082067374088": {
                    "tweet_id": "1259924082067374088",
                    "username": "karllorey"
                }
                }
            },
            "user": {
                "note": "Allowed for usernames are alphanumeric characters and underscores.",
                "regex": "(?:https?:)?\\/\\/(?:[A-z]+\\.)?twitter\.com\\/@?(?!home|share|privacy|tos)([A-z0-9_]+)\\/?",
                "tests": {
                    "htt://twitter.com/karllorey": null,
                    "http://twitter.com/@karllorey": {
                        "username": "karllorey"
                    },
                    "http://twitter.com/karllorey": {
                        "username": "karllorey"
                    },
                    "https://twitter.com/home": null,
                    "https://twitter.com/karllorey": {
                        "username": "karllorey"
                    },
                    "https://twitter.com/privacy": null,
                    "https://twitter.com/share": null,
                    "https://twitter.com/tos": null
                }
            }
        },
        "vimeo": {
            "user": {
                "regex": "(?:https?:)?\\/\\/vimeo\\.com\\/user(?P<id>[0-9]+)",
                "tests": {
                "https://vimeo.com/user46726126": {
                    "id": "46726126"
                }
                }
            },
            "video": {
                "regex": "(?:https?:)?\\/\\/(?:(?:www)?vimeo\\.com|player.vimeo.com\\/video)\\/(?P<id>[0-9]+)",
                "tests": {
                "https://player.vimeo.com/video/148751763": {
                    "id": "148751763"
                },
                "https://vimeo.com/148751763": {
                    "id": "148751763"
                }
                }
            }
        },
        "xing": {
        "profile": {
            "note": "Default slugs are Firstname_Lastname. If several people with the same name exist, a number is appended.",
            "regex": "(?:https?:)?\\/\\/(?:www\\.)?xing.com\\/profile\\/(?P<slug>[A-z0-9-\\_]+)",
            "tests": {
            "https://www.xing.com/profile/Tobias_Zilbersahn5": {
                "slug": "Tobias_Zilbersahn5"
            }
            }
        }
        },
        "youtube": {
        "channel": {
            "regex": "(?:https?:)?\\/\\/(?:[A-z]+\\.)?youtube.com\\/channel\\/(?P<id>[A-z0-9-\\_]+)\\/?",
            "tests": {
            "https://www.youtube.com/channel/UC3y00Z1zFPc-8Z9xg8ydC-A": {
                "id": "UC3y00Z1zFPc-8Z9xg8ydC-A"
            },
            "https://www.youtube.com/channel/UCtAh1m085QkEKYNg0j_6r8A": {
                "id": "UCtAh1m085QkEKYNg0j_6r8A"
            }
            }
        },
        "user": {
            "regex": "(?:https?:)?\\/\\/(?:[A-z]+\\.)?youtube.com\\/user\\/(?P<username>[A-z0-9]+)\\/?",
            "tests": {
            "https://www.youtube.com/user/JPPGmbH": {
                "username": "JPPGmbH"
            }
            }
        },
        "video": {
            "note": "Matches youtube video links like https://www.youtube.com/watch?v=dQw4w9WgXcQ and shortlinks like https://youtu.be/dQw4w9WgXcQ",
            "regex": "(?:https?:)?\\/\\/(?:(?:www\\.)?youtube\\.com\\/(?:watch\\?v=|embed\\/)|youtu\\.be\\/)(?P<id>[A-z0-9\\-\\_]+)",
            "tests": {
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ": {
                "id": "dQw4w9WgXcQ"
            },
            "https://youtu.be/dQw4w9WgXcQ": {
                "id": "dQw4w9WgXcQ"
            },
            "https://youtube.com/embed/dQw4w9WgXcQ": {
                "id": "dQw4w9WgXcQ"
            },
            "https://youtube.com/watch?v=6_b7RDuLwcI": {
                "id": "6_b7RDuLwcI"
            }
            }
        }
        }
  }